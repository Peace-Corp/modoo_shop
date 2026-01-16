'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  size: string | null;
  products: {
    id: string;
    name: string;
    images: string[];
    price: number;
  };
}

interface Order {
  id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'toss' | 'paypal';
  payment_status: 'pending' | 'completed' | 'failed';
  order_name: string;
  customer_name: string;
  customer_email: string;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  shipping_country: string;
  shipping_phone: string;
  created_at: string;
  order_items: OrderItem[];
}

const statusLabels: Record<Order['status'], string> = {
  pending: '주문 접수',
  processing: '처리 중',
  shipped: '배송 중',
  delivered: '배송 완료',
  cancelled: '취소됨',
};

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusLabels: Record<Order['payment_status'], string> = {
  pending: '결제 대기',
  completed: '결제 완료',
  failed: '결제 실패',
};

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError('주문번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/${orderId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '주문을 찾을 수 없습니다.');
        return;
      }

      setOrder(data);
    } catch (err) {
      console.error('Order lookup error:', err);
      setError('주문 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">주문조회</h1>
          <p className="text-gray-600">주문번호를 입력하여 주문 상태를 확인하세요.</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="주문번호 (예: ORD-20240101-ABC123)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  error={error || undefined}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="sm:w-auto">
                {isLoading ? '조회 중...' : '조회'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Status Card */}
            <Card>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">주문번호</p>
                    <p className="font-mono font-medium text-gray-900">{order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium self-start ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">주문일시</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">결제 상태</p>
                    <p className="font-medium text-gray-900">
                      {paymentStatusLabels[order.payment_status]}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">결제 수단</p>
                    <p className="font-medium text-gray-900">
                      {order.payment_method === 'toss' ? '토스페이먼츠' : 'PayPal'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">총 결제금액</p>
                    <p className="font-bold text-indigo-600">
                      {order.total.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardContent>
                <h2 className="font-semibold text-gray-900 mb-4">주문 상품</h2>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.products.images?.[0] ? (
                          <Image
                            src={item.products.images[0]}
                            alt={item.products.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.products.name}</p>
                        {item.size && (
                          <p className="text-sm text-gray-500">사이즈: {item.size}</p>
                        )}
                        <p className="text-sm text-gray-500">수량: {item.quantity}개</p>
                        <p className="font-medium text-gray-900 mt-1">
                          {(item.price_at_time * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent>
                <h2 className="font-semibold text-gray-900 mb-4">배송 정보</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="text-gray-500 w-24 flex-shrink-0">수령인</span>
                    <span className="text-gray-900">{order.customer_name}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24 flex-shrink-0">연락처</span>
                    <span className="text-gray-900">{order.shipping_phone}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24 flex-shrink-0">이메일</span>
                    <span className="text-gray-900">{order.customer_email}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24 flex-shrink-0">배송지</span>
                    <span className="text-gray-900">
                      {order.shipping_country === 'KR' ? (
                        <>
                          {order.shipping_street}, {order.shipping_city} {order.shipping_zip_code}
                        </>
                      ) : (
                        <>
                          {order.shipping_street}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip_code}, {order.shipping_country}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!order && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500">주문번호를 입력하면 주문 내역이 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}