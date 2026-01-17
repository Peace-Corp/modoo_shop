import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { sendOrderConfirmationEmail } from '@/lib/mailjet';
import { sendOrderNotification } from '@/lib/discord';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments/confirm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: paymentKey, orderId, amount' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check if order is already completed to prevent duplicate confirmation
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, payment_status, payment_key, order_name, total, updated_at')
      .eq('id', orderId)
      .single();

    if (existingOrder?.payment_status === 'completed') {
      // Order already processed, return success with existing data
      return NextResponse.json({
        success: true,
        payment: {
          paymentKey: existingOrder.payment_key,
          orderId: existingOrder.id,
          orderName: existingOrder.order_name,
          amount: existingOrder.total,
          status: 'DONE',
          method: '카드',
          approvedAt: existingOrder.updated_at,
        },
      });
    }

    // Encode secret key for Basic Auth
    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');

    // Call Toss Payments API to confirm the payment
    const response = await fetch(TOSS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Toss payment confirmation failed:', data);
      return NextResponse.json(
        {
          error: data.message || 'Payment confirmation failed',
          code: data.code,
        },
        { status: response.status }
      );
    }

    // Payment confirmed successfully - update the order in database
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'completed',
        payment_key: data.paymentKey,
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Order update error:', updateError);
      // Payment was successful but order update failed
      // Log this for manual reconciliation
    }

    // Deduct inventory for each order item with a variant
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('variant_id, quantity')
      .eq('order_id', orderId)
      .not('variant_id', 'is', null);

    if (itemsError) {
      console.error('Failed to fetch order items for inventory deduction:', itemsError);
    } else if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        if (item.variant_id) {
          const { error: stockError } = await supabase.rpc('decrement_variant_stock', {
            p_variant_id: item.variant_id,
            p_quantity: item.quantity,
          });

          if (stockError) {
            console.error(`Failed to deduct stock for variant ${item.variant_id}:`, stockError);
          }
        }
      }
    }

    // Send order confirmation email
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            size,
            products (
              name
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderData) {
        const shippingAddress = [
          orderData.shipping_street,
          orderData.shipping_city,
          orderData.shipping_state,
          orderData.shipping_zip_code,
          orderData.shipping_country,
        ]
          .filter(Boolean)
          .join(', ');

        const emailItems = orderData.order_items?.map((item: { products: { name: string } | null; size: string | null; quantity: number; price_at_time: number }) => ({
          name: item.products?.name || 'Unknown Product',
          size: item.size || undefined,
          quantity: item.quantity,
          price: item.price_at_time * item.quantity,
        })) || [];

        const subtotal = emailItems.reduce((sum: number, item: { price: number }) => sum + item.price, 0);
        const shipping = orderData.total - subtotal;

        await sendOrderConfirmationEmail({
          orderId: orderData.id,
          orderName: orderData.order_name || data.orderName,
          customerName: orderData.customer_name || '고객',
          customerEmail: orderData.customer_email || '',
          items: emailItems,
          subtotal,
          shipping: shipping > 0 ? shipping : 0,
          total: orderData.total,
          paymentMethod: '토스페이먼츠',
          shippingAddress,
          orderDate: new Date(data.approvedAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        });

        // Send Discord notification
        await sendOrderNotification({
          orderId: orderData.id,
          orderName: orderData.order_name || data.orderName,
          customerName: orderData.customer_name || '고객',
          customerEmail: orderData.customer_email || '',
          items: emailItems,
          total: orderData.total,
          paymentMethod: '토스페이먼츠',
          shippingAddress,
        });
      }
    } catch (notificationError) {
      console.error('Failed to send notifications:', notificationError);
      // Don't fail the payment confirmation if notifications fail
    }

    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: data.paymentKey,
        orderId: data.orderId,
        orderName: data.orderName,
        amount: data.totalAmount,
        status: data.status,
        method: data.method,
        approvedAt: data.approvedAt,
        receipt: data.receipt?.url,
      },
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during payment confirmation' },
      { status: 500 }
    );
  }
}
