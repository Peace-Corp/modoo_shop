import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const IS_SANDBOX = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === 'true';
const PAYPAL_API_URL = IS_SANDBOX
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal auth error:', error);
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  return data.access_token;
}

interface CaptureOrderRequest {
  paypalOrderId: string;
  orderId: string; // Our internal order ID
}

export async function POST(request: NextRequest) {
  try {
    const body: CaptureOrderRequest = await request.json();
    const { paypalOrderId, orderId } = body;

    if (!paypalOrderId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: paypalOrderId and orderId are required' },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    // Capture the PayPal order
    const captureResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!captureResponse.ok) {
      const error = await captureResponse.json();
      console.error('PayPal capture error:', error);
      return NextResponse.json(
        { error: 'Failed to capture PayPal payment', details: error },
        { status: captureResponse.status }
      );
    }

    const captureData = await captureResponse.json();

    // Verify the payment was completed
    if (captureData.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment was not completed', status: captureData.status },
        { status: 400 }
      );
    }

    // Update our order in the database
    const supabase = createServerClient();

    const captureDetails = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    const paypalTransactionId = captureDetails?.id;

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'completed',
        status: 'processing',
        payment_key: paypalTransactionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Order update error:', updateError);
      // Payment was successful, but database update failed
      // Log this for manual reconciliation
      return NextResponse.json({
        success: true,
        warning: 'Payment captured but order update failed',
        paypalOrderId: captureData.id,
        paypalTransactionId,
        captureStatus: captureData.status,
      });
    }

    return NextResponse.json({
      success: true,
      paypalOrderId: captureData.id,
      paypalTransactionId,
      captureStatus: captureData.status,
      payer: {
        name: captureData.payer?.name,
        email: captureData.payer?.email_address,
      },
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
