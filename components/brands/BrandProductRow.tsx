'use client';

import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import { useBrandCart } from '@/contexts/BrandCartContext';
import { formatPrice } from '@/lib/utils';

const DEFAULT_VARIANT_ID = '__default__';

interface BrandProductRowProps {
  product: Product;
}

export function BrandProductRow({ product }: BrandProductRowProps) {
  const { setQuantity, getQuantity } = useBrandCart();
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;

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

  // For products without variants, use a default variant
  const defaultVariant: ProductVariant = {
    id: DEFAULT_VARIANT_ID,
    productId: product.id,
    size: 'default',
    stock: 999,
    sortOrder: 0,
  };

  const handleDefaultIncrement = () => {
    const currentQty = getQuantity(product.id, DEFAULT_VARIANT_ID);
    setQuantity(product.id, DEFAULT_VARIANT_ID, product, defaultVariant, currentQty + 1);
  };

  const handleDefaultDecrement = () => {
    const currentQty = getQuantity(product.id, DEFAULT_VARIANT_ID);
    if (currentQty > 0) {
      setQuantity(product.id, DEFAULT_VARIANT_ID, product, defaultVariant, currentQty - 1);
    }
  };

  return (
    <div className="py-4 first:pt-0 last:pb-0">
      {/* Product Info */}
      <div className="flex gap-3">
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

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
          <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatPrice(product.price)}</p>
        </div>
      </div>

      {/* No variants - simple quantity control */}
      {!hasVariants && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">수량</span>
          <QuantityControl
            quantity={getQuantity(product.id, DEFAULT_VARIANT_ID)}
            onIncrement={handleDefaultIncrement}
            onDecrement={handleDefaultDecrement}
          />
        </div>
      )}

      {/* Variant rows */}
      {hasVariants && (
        <div className="mt-3 space-y-2">
          {variants.map(variant => {
            const quantity = getQuantity(product.id, variant.id);
            const isOutOfStock = variant.stock === 0;

            return (
              <div
                key={variant.id}
                className="flex items-center justify-between bg-gray-100 rounded-full px-4 py-2"
              >
                <span className="text-sm font-medium text-gray-700">{variant.size}</span>
                {isOutOfStock ? (
                  <span className="text-xs text-red-400 font-medium">품절</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <QuantityControl
                      quantity={quantity}
                      onIncrement={() => handleIncrement(variant)}
                      onDecrement={() => handleDecrement(variant)}
                      disableIncrement={quantity >= variant.stock}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  disableIncrement = false,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disableIncrement?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onDecrement}
        disabled={quantity === 0}
        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
          quantity === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
      >
        &minus;
      </button>
      <span className="w-6 text-center text-sm font-medium">{quantity}</span>
      <button
        onClick={onIncrement}
        disabled={disableIncrement}
        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
          disableIncrement
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
        }`}
      >
        +
      </button>
    </div>
  );
}
