'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Brand } from '@/types';
import { ProductVariantModal } from './ProductVariantModal';

interface ProductCardProps {
  product: Product;
  brand?: Brand;
}

export function ProductCard({ product, brand }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <Link
        href={product.brandId === 'brand-1' ? 'https://www.youmakeit.shop/home' : `/products/${product.id}`}
        // href={`/products/${product.id}`}
        rel="noopener noreferrer"
        className="group block bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
              -{discount}%
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#0052cc] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
              추천
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Cart Button */}
          {/* <button
            onClick={handleCartClick}
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white text-gray-700"
            aria-label="장바구니에 담기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button> */}
        </div>

        <div className="p-2 sm:p-4">
          {brand && (
            <p className="text-[10px] sm:text-xs font-medium text-[#0052cc] mb-0.5 sm:mb-1">{brand.name}</p>
          )}
          <h3 className="text-xs sm:text-base font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-1 mb-1 sm:mb-2">{product.description}</p>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-base font-bold text-gray-900">{product.price.toLocaleString()}원</span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString()}원
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Product Variant Modal */}
      <ProductVariantModal
        product={product}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
