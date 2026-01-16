'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';

interface PaymentResult {
  success: boolean;
  payment?: {
    paymentKey: string;
    orderId: string;
    orderName: string;
    amount: number;
    status: string;
    method: string;
    approvedAt: string;
    receipt?: string;
  };
  error?: string;
  code?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentMethod = searchParams.get('paymentMethod');
      const orderId = searchParams.get('orderId');

      // Handle PayPal payments
      if (paymentMethod === 'paypal' && orderId) {
        try {
          // Fetch order details from database
          const response = await fetch(`/api/orders/${orderId}`);
          const data = await response.json();

          if (!response.ok) {
            setResult({
              success: false,
              error: data.error || '주문 정보를 불러올 수 없습니다.',
            });
          } else {
            // Clear cart after successful PayPal payment
            clearCart();
            setResult({
              success: true,
              payment: {
                paymentKey: data.payment_key || '',
                orderId: data.id,
                orderName: data.order_name,
                amount: data.total,
                status: data.payment_status,
                method: 'PayPal',
                approvedAt: data.updated_at || data.created_at,
              },
            });
          }
        } catch (error) {
          console.error('Order fetch error:', error);
          setResult({
            success: false,
            error: '주문 정보를 불러오는 중 오류가 발생했습니다.',
          });
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // Handle Toss payments
      const paymentKey = searchParams.get('paymentKey');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setResult({
          success: false,
          error: '결제 정보가 올바르지 않습니다.',
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
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
          setResult({
            success: false,
            error: data.error || '결제 확인에 실패했습니다.',
            code: data.code,
          });
        } else {
          // Clear cart after successful Toss payment
          clearCart();
          setResult(data);
        }
      } catch (error) {
        console.error('Payment confirmation error:', error);
        setResult({
          success: false,
          error: '결제 확인 중 오류가 발생했습니다.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, clearCart]);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 중...</h1>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result?.success) {
    return (
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">결제 확인 실패</h1>
            <p className="text-gray-600 mb-6">{result?.error}</p>
            {result?.code && (
              <p className="text-sm text-gray-500 mb-6">오류 코드: {result.code}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout">
                <Button variant="outline">다시 시도하기</Button>
              </Link>
              <Link href="/">
                <Button>홈으로</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const payment = result.payment!;

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h1>
          <p className="text-gray-600 mb-6">
            주문해 주셔서 감사합니다. 결제가 정상적으로 처리되었습니다.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-medium text-gray-900">{payment.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">주문명</span>
              <span className="font-medium text-gray-900">{payment.orderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 금액</span>
              <span className="font-bold text-gray-900">{payment.amount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 수단</span>
              <span className="font-medium text-gray-900">{payment.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 일시</span>
              <span className="font-medium text-gray-900">
                {new Date(payment.approvedAt).toLocaleString('ko-KR')}
              </span>
            </div>
          </div>

          {payment.receipt && (
            <a
              href={payment.receipt}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-indigo-600 hover:text-indigo-700 mb-6"
            >
              영수증 보기
            </a>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button variant="outline">쇼핑 계속하기</Button>
            </Link>
            <Link href="/">
              <Button>홈으로</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로딩 중...</h1>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
