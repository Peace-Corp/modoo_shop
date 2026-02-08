'use client';

import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import { useBrandCart } from '@/contexts/BrandCartContext';

interface BrandProductRowProps {
  product: Product;
}

export function BrandProductRow({ product }: BrandProductRowProps) {
  const { setQuantity, getQuantity } = useBrandCart();
  const variants = product.variants ?? [];

  // Check if any variant is selected
  const hasSelections = variants.some(v => getQuantity(product.id, v.id) > 0);

  // Get selected items for tags
  const selectedItems = variants
    .map(v => ({ variant: v, quantity: getQuantity(product.id, v.id) }))
    .filter(item => item.quantity > 0);

  const handleIncrement = (variant: ProductVariant) => {
    const currentQty = getQuantity(product.id, variant.id);
    if (currentQty < variant.stock) {
      setQuantity(product.id, variant.id, product, variant, currentQty + 1);
    }
  };

  const handleDecrement = (variant: ProductVariant) => {
    const currentQty = getQuantity(product.id, variant.id);
    if (currentQty > 0) {
      setQuantity(product.id, variant.id, product, variant, currentQty - 1);
    }
  };

  const handleRemoveTag = (variant: ProductVariant) => {
    setQuantity(product.id, variant.id, product, variant, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <div
      className={`p-3 border rounded-lg transition-all ${
        hasSelections
          ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
          : 'border-gray-200'
      }`}
    >
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={80}
              height={80}
              unoptimized
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

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
            {product.name}
          </h3>
          <p className="text-sm sm:text-base font-semibold text-gray-900 mt-0.5">
            {formatPrice(product.price)}
          </p>

          {/* Variant Selectors */}
          {variants.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {variants.map(variant => {
                const quantity = getQuantity(product.id, variant.id);
                const isOutOfStock = variant.stock === 0;
                const isAtMax = quantity >= variant.stock;

                return (
                  <div
                    key={variant.id}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs sm:text-sm ${
                      isOutOfStock
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{variant.size}</span>
                    <span className="text-gray-400">({variant.stock})</span>

                    {!isOutOfStock && (
                      <>
                        <button
                          onClick={() => handleDecrement(variant)}
                          disabled={quantity === 0}
                          className={`w-5 h-5 flex items-center justify-center rounded ${
                            quantity === 0
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => handleIncrement(variant)}
                          disabled={isAtMax}
                          className={`w-5 h-5 flex items-center justify-center rounded ${
                            isAtMax
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Items Tags */}
          {selectedItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedItems.map(({ variant, quantity }) => (
                <span
                  key={variant.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                >
                  {variant.size} x {quantity}
                  <button
                    onClick={() => handleRemoveTag(variant)}
                    className="hover:text-blue-900"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
