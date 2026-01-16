'use client';

import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useState } from 'react';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export interface PayPalPaymentButtonProps {
  /** Amount in KRW */
  amount: number;
  /** Internal order ID */
  orderId: string;
  /** Order description */
  orderName: string;
  /** Called before creating PayPal order - use for creating order in your database */
  onBeforeCreateOrder?: () => Promise<boolean>;
  /** Called when payment is successful */
  onSuccess?: (details: PayPalSuccessDetails) => void;
  /** Called when payment fails or is cancelled */
  onError?: (error: Error) => void;
  /** Called when user cancels the payment */
  onCancel?: () => void;
}

export interface PayPalSuccessDetails {
  paypalOrderId: string;
  paypalTransactionId?: string;
  orderId: string;
  payer?: {
    name?: { given_name?: string; surname?: string };
    email?: string;
  };
}

function PayPalButtonWrapper({
  amount,
  orderId,
  orderName,
  onBeforeCreateOrder,
  onSuccess,
  onError,
  onCancel,
}: PayPalPaymentButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createOrder = async (): Promise<string> => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Call onBeforeCreateOrder to create order in database
      if (onBeforeCreateOrder) {
        const success = await onBeforeCreateOrder();
        if (!success) {
          throw new Error('Failed to create order');
        }
      }

      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount,
          currency: 'KRW',
          description: orderName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal order');
      }

      return data.id;
    } catch (error) {
      console.error('Create order error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create order';
      setErrorMessage(errorMsg);
      onError?.(error instanceof Error ? error : new Error(errorMsg));
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const onApprove = async (data: { orderID: string }): Promise<void> => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Capture the PayPal order
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
          orderId,
        }),
      });

      const captureData = await response.json();

      if (!response.ok) {
        throw new Error(captureData.error || 'Failed to capture PayPal payment');
      }

      onSuccess?.({
        paypalOrderId: captureData.paypalOrderId,
        paypalTransactionId: captureData.paypalTransactionId,
        orderId,
        payer: captureData.payer,
      });
    } catch (error) {
      console.error('Capture order error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to capture payment';
      setErrorMessage(errorMsg);
      onError?.(error instanceof Error ? error : new Error(errorMsg));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (err: Record<string, unknown>) => {
    console.error('PayPal error:', err);
    const errorMsg = 'PayPal payment failed. Please try again.';
    setErrorMessage(errorMsg);
    onError?.(new Error(errorMsg));
  };

  const handleCancel = () => {
    setErrorMessage('Payment was cancelled');
    onCancel?.();
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">PayPal loading...</span>
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {isProcessing && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600">Processing payment...</p>
        </div>
      )}

      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48,
        }}
        disabled={isProcessing}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={handleError}
        onCancel={handleCancel}
      />

      <p className="text-xs text-gray-500 text-center mt-3">
        Secure payment powered by PayPal
      </p>
    </div>
  );
}

export default function PayPalPaymentButton(props: PayPalPaymentButtonProps) {
  if (!clientId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-700">
          PayPal is not configured. Please add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD', // PayPal will display in USD (converted from KRW)
        intent: 'capture',
      }}
    >
      <PayPalButtonWrapper {...props} />
    </PayPalScriptProvider>
  );
}