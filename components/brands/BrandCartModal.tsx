'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogCloseButton } from '@/components/ui/Dialog';
import { BrandProductRow } from './BrandProductRow';
import { useBrandCart } from '@/contexts/BrandCartContext';

export function BrandCartModal() {
  const router = useRouter();
  const {
    brandId,
    brandName,
    products,
    isOpen,
    closeCart,
    clearCart,
    getTotal,
    getItemCount,
  } = useBrandCart();

  const total = getTotal();
  const itemCount = getItemCount();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  const handleCheckout = () => {
    if (itemCount === 0) return;
    closeCart();
    router.push(`/checkout?brandId=${brandId}`);
  };

  return (
    <Dialog open={isOpen} onClose={closeCart}>
      <DialogContent className="relative max-w-2xl">
        {/* Header */}
        <DialogHeader className="flex items-center justify-between">
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm font-medium"
          >
            장바구니 비우기
          </button>
          <DialogCloseButton onClose={closeCart} />
        </DialogHeader>

        {/* Body - Product List */}
        <DialogBody className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            {products.map(product => (
              <BrandProductRow key={product.id} product={product} />
            ))}

            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                상품이 없습니다.
              </div>
            )}
          </div>
        </DialogBody>

        {/* Footer - Total and Checkout */}
        <DialogFooter className="flex-col items-stretch">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">
              총금액 <span className="text-xs text-gray-400">(배송비 제외)</span>
            </span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={itemCount === 0}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              itemCount === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            결제하기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
