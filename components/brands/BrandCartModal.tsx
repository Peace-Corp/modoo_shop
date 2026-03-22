'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogCloseButton } from '@/components/ui/Dialog';
import { BrandProductRow } from './BrandProductRow';
import { useBrandCart } from '@/contexts/BrandCartContext';
import { formatPrice } from '@/lib/utils';

export function BrandCartModal() {
  const router = useRouter();
  const {
    brandId,
    products,
    isOpen,
    closeCart,
    getTotal,
    getItemCount,
  } = useBrandCart();

  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    if (itemCount === 0) return;
    closeCart();
    router.push(`/checkout?brandId=${brandId}`);
  };

  return (
    <Dialog open={isOpen} onClose={closeCart}>
      <DialogContent className="relative w-full min-w-75 max-w-lg">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>제품 주문</DialogTitle>
          <DialogCloseButton onClose={closeCart} />
        </DialogHeader>

        <DialogBody className="max-h-[60vh] overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {products.map(product => (
              <BrandProductRow key={product.id} product={product} />
            ))}

            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                상품이 없습니다.
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="flex-col items-stretch">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">총금액</span>
            <span className="text-base font-bold text-gray-900">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={itemCount === 0}
            className={`w-full py-3 rounded-lg text-sm font-semibold text-white transition-colors ${
              itemCount === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            구매하기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
