import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

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
    const supabase = createServerClient();

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
