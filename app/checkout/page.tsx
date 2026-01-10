'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type PaymentMethod = 'toss' | 'paypal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('toss');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    addressDetail: '',
    zipCode: '',
  });

  useEffect(() => {
    if (user?.email) {
      setShippingInfo(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">장바구니가 비어있습니다</h1>
          <p className="text-gray-600 mb-8">결제하기 전에 상품을 담아주세요.</p>
          <Link href="/search">
            <Button size="lg">상품 둘러보기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate order number
    const newOrderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderNumber(newOrderNumber);
    clearCart();
    setStep('success');
    setIsProcessing(false);
  };

  if (step === 'success') {
    return (
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h1>
            <p className="text-gray-600 mb-6">
              주문해 주셔서 감사합니다. 결제가 정상적으로 처리되었습니다.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-500">주문번호</p>
              <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              주문 확인 이메일이 {shippingInfo.email}로 발송되었습니다
            </p>
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

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step === 'info' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
              1
            </div>
            <span className="ml-2 font-medium text-gray-900">배송정보</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200 mx-4" />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <span className={`ml-2 font-medium ${step === 'payment' ? 'text-gray-900' : 'text-gray-500'}`}>결제</span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {step === 'info' && (
              <form onSubmit={handleSubmitInfo}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">주문자 정보</h2>
                  <div className="space-y-4">
                    <Input
                      label="이름"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="이메일"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        required
                      />
                      <Input
                        label="연락처"
                        type="tel"
                        placeholder="010-0000-0000"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">배송지 정보</h2>
                  <div className="space-y-4">
                    <Input
                      label="우편번호"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      placeholder="12345"
                      required
                    />
                    <Input
                      label="주소"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      placeholder="시/도, 구/군, 동/읍/면"
                      required
                    />
                    <Input
                      label="상세주소"
                      value={shippingInfo.addressDetail}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, addressDetail: e.target.value })}
                      placeholder="아파트명, 동/호수"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  결제하기
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">결제 수단</h2>

                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    {/* Toss Payments */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'toss' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'toss'}
                        onChange={() => setPaymentMethod('toss')}
                        className="sr-only"
                      />
                      <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xs">Toss</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">토스페이먼츠</p>
                        <p className="text-sm text-gray-500">토스로 빠르고 안전하게 결제</p>
                      </div>
                      {paymentMethod === 'toss' && (
                        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>

                    {/* PayPal */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="sr-only"
                      />
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xs">PP</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-500">페이팔로 안전하게 결제</p>
                      </div>
                      {paymentMethod === 'paypal' && (
                        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  </div>
                </div>

                {/* Payment Widget Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  {paymentMethod === 'toss' ? (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">토스페이먼츠</h3>
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <p className="text-gray-600 mb-2">토스 결제 위젯</p>
                        <p className="text-sm text-gray-500">
                          &quot;결제하기&quot; 버튼을 눌러 토스로 결제를 완료하세요
                        </p>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                          실제 서비스에서는 TossPayments SDK가 연동됩니다.
                          <br />
                          @tosspayments/payment-widget-sdk 사용
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">PayPal</h3>
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <p className="text-gray-600 mb-2">PayPal 결제</p>
                        <p className="text-sm text-gray-500">
                          &quot;결제하기&quot; 버튼을 눌러 PayPal로 결제를 완료하세요
                        </p>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                          실제 서비스에서는 PayPal SDK가 연동됩니다.
                          <br />
                          @paypal/react-paypal-js 사용
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep('info')}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePayment}
                    isLoading={isProcessing}
                    className="flex-1"
                  >
                    {total.toLocaleString()}원 결제하기
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 요약</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">수량: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>상품금액</span>
                  <span>{subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>{shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                  <span>총 결제금액</span>
                  <span>{total.toLocaleString()}원</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm">SSL 보안 암호화</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
