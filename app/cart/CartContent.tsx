'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { Brand } from '@/types';

interface CartContentProps {
  brands: Brand[];
}

export default function CartContent({ brands }: CartContentProps) {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  // Create a lookup map for brands
  const brandMap = new Map(brands.map(b => [b.id, b]));

  if (items.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">장바구니가 비어있습니다</h1>
          <p className="text-gray-600 mb-8">아직 장바구니에 담긴 상품이 없습니다.</p>
          <Link href="/search">
            <Button size="lg">쇼핑하러 가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = 3000;
  const total = subtotal + shipping;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">장바구니</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            전체 삭제
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {items.map((item, index) => {
                const brand = brandMap.get(item.product.brandId);
                const itemKey = item.variant ? `${item.product.id}-${item.variant.id}` : item.product.id;
                return (
                  <div
                    key={itemKey}
                    className={`p-6 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            {brand && (
                              <p className="text-sm text-indigo-600 font-medium mb-1">
                                {brand.name}
                              </p>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.product.name}
                            </h3>
                            {item.variant && (
                              <p className="text-sm text-gray-700 font-medium mb-1">
                                사이즈: {item.variant.size}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {item.product.description}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.variant?.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                                disabled={item.variant && item.quantity >= item.variant.stock}
                                className={`w-10 h-10 flex items-center justify-center ${
                                  item.variant && item.quantity >= item.variant.stock
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            {item.variant && item.quantity >= item.variant.stock && (
                              <p className="text-xs text-orange-600">최대 수량입니다</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {(item.product.price * item.quantity).toLocaleString()}원
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                개당 {item.product.price.toLocaleString()}원
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/search"
                className="inline-flex items-center text-indigo-600 font-medium hover:underline"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                쇼핑 계속하기
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 요약</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품금액 ({items.length}개)</span>
                  <span>{subtotal.toLocaleString()}원</span>
                </div>
                {/* <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>{shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}</span>
                </div> */}
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900">
                  <span>총 금액</span>
                  <span>{total.toLocaleString()}원</span>
                </div>
              </div>

              {/* {shipping > 0 && (
                <div className="bg-indigo-50 rounded-lg p-3 mb-6">
                  <p className="text-sm text-indigo-700">
                    {(50000 - subtotal).toLocaleString()}원 더 담으면 무료배송!
                  </p>
                </div>
              )} */}

              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  결제하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
