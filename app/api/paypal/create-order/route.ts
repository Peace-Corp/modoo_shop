import { NextRequest, NextResponse } from 'next/server';

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

interface CreateOrderRequest {
  orderId: string;
  amount: number;
  currency?: string;
  description?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { orderId, amount, currency = 'USD', description } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and amount are required' },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    // Convert KRW to USD if necessary (PayPal doesn't support KRW directly)
    // For production, use a real exchange rate API
    let paypalAmount = amount;
    let paypalCurrency = currency;

    if (currency === 'KRW') {
      // Approximate exchange rate - in production, use a real-time rate
      const exchangeRate = 0.00075; // 1 KRW = ~0.00075 USD
      paypalAmount = Math.round(amount * exchangeRate * 100) / 100;
      paypalCurrency = 'USD';
    }

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          description: description || `Order ${orderId}`,
          amount: {
            currency_code: paypalCurrency,
            value: paypalAmount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'Modoo Shop',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/fail`,
      },
    };

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': orderId, // Idempotency key
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('PayPal create order error:', error);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: error },
        { status: response.status }
      );
    }

    const paypalOrder = await response.json();

    return NextResponse.json({
      id: paypalOrder.id,
      status: paypalOrder.status,
    });
  } catch (error) {
    console.error('PayPal create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
