'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseButton,
} from '@/components/ui/Dialog';

interface ProductVariantModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function ProductVariantModal({
  product,
  open,
  onClose,
}: ProductVariantModalProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedVariant(null);
      setQuantity(1);
      setIsAdding(false);
    }
  }, [open]);

  const handleAddToCart = () => {
    setIsAdding(true);

    if (hasVariants && !selectedVariant) {
      setIsAdding(false);
      return;
    }

    addToCart(product, quantity, selectedVariant || undefined);

    // Show success briefly then close
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 300);
  };

  const isOutOfStock = (variant: ProductVariant) => variant.stock <= 0;

  const canAddToCart = !hasVariants || (selectedVariant && selectedVariant.stock > 0);

  const maxQuantity = selectedVariant?.stock || 99;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative">
        <DialogCloseButton onClose={onClose} />

        <DialogHeader>
          <DialogTitle>옵션 선택</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Product Info */}
          <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  {product.price.toLocaleString()}원
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      {product.originalPrice.toLocaleString()}원
                    </span>
                    <span className="text-xs font-semibold text-red-500">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Variant Selection */}
          {hasVariants && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이즈
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => {
                  const outOfStock = isOutOfStock(variant);
                  const isSelected = selectedVariant?.id === variant.id;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => !outOfStock && setSelectedVariant(variant)}
                      disabled={outOfStock}
                      className={`
                        min-w-[48px] px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all
                        ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : outOfStock
                            ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      {variant.size}
                      {outOfStock && (
                        <span className="block text-[10px] text-gray-400 no-underline">
                          품절
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수량
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="w-12 text-center text-base font-medium text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                disabled={quantity >= maxQuantity}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Selected Summary */}
          {(selectedVariant || !hasVariants) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {selectedVariant ? `${product.name} / ${selectedVariant.size}` : product.name}
                </span>
                <span className="font-medium text-gray-900">
                  {(product.price * quantity).toLocaleString()}원
                </span>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            isLoading={isAdding}
            className="sm:w-auto w-full"
          >
            {hasVariants && !selectedVariant
              ? '옵션을 선택해주세요'
              : '장바구니 담기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
