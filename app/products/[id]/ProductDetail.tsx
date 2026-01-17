'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/products/ProductCard';
import { Product, Brand, ProductVariant } from '@/types';

interface ProductDetailProps {
  product: Product;
  brand: Brand | undefined;
  relatedProducts: Product[];
}

export default function ProductDetail({ product, brand, relatedProducts }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  const hasVariants = product.variants && product.variants.length > 0;
  const currentStock = selectedVariant?.stock ?? 0;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant ?? undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const canAddToCart = selectedVariant !== null && selectedVariant.stock > 0;

  return (
    <div className="py-3 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-4 sm:mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700">홈</Link>
          <span className="text-gray-400">/</span>
          {brand && (
            <>
              <Link href={`/brands/${brand.slug}`} className="text-gray-500 hover:text-gray-700">
                {brand.name}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 mb-2 sm:mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                unoptimized
                className="w-full h-full object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-14 h-14 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-3 sm:mt-0">
            {brand && (
              <Link
                href={`/brands/${brand.slug}`}
                className="inline-block text-xs sm:text-sm font-medium text-indigo-600 hover:underline mb-1 sm:mb-2"
              >
                {brand.name}
              </Link>
            )}
            <h1 className="text-lg sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">{product.name}</h1>

            {/* Rating */}
            {/* <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs sm:text-base text-gray-600">{product.rating}</span>
              <span className="text-gray-400">|</span>
              <span className="text-xs sm:text-base text-gray-600">{product.reviewCount}개 리뷰</span>
            </div> */}

            {/* Price */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
              <span className="text-xl sm:text-3xl font-bold text-gray-900">{product.price.toLocaleString()}원</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm sm:text-xl text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()}원
                  </span>
                  <span className="bg-red-100 text-red-700 text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-6">{product.description}</p>

            {/* Size Selector */}
            {hasVariants && (
              <div className="mb-3 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">사이즈 선택</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.variants!.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1);
                      }}
                      disabled={variant.stock === 0}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg border-2 text-xs sm:text-sm font-medium transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : variant.stock === 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {variant.size}
                      {variant.stock === 0 && ' (품절)'}
                    </button>
                  ))}
                </div>
                {hasVariants && !selectedVariant && (
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-amber-600">사이즈를 선택해주세요</p>
                )}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-6">
              {currentStock > 0 ? (
                <>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full" />
                  <span className="text-xs sm:text-base text-green-600 font-medium">재고 있음</span>
                  <span className="text-xs sm:text-base text-gray-400">({currentStock}개 남음)</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full" />
                  <span className="text-xs sm:text-base text-red-600 font-medium">
                    {hasVariants && !selectedVariant ? '사이즈 선택 필요' : '품절'}
                  </span>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div className="flex items-center border border-gray-300 rounded-md sm:rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  disabled={!canAddToCart}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 sm:w-12 text-center text-sm sm:text-base font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  disabled={!canAddToCart}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 text-xs sm:text-base py-2 sm:py-3"
                disabled={!canAddToCart}
              >
                {isAdded ? (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    담기 완료
                  </>
                ) : hasVariants && !selectedVariant ? (
                  '사이즈를 선택해주세요'
                ) : (
                  '장바구니 담기'
                )}
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-6">
              {product.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/search?q=${tag}`}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-full hover:bg-gray-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Features */}
            {/* <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">무료 배송</p>
                    <p className="text-xs text-gray-500">5만원 이상 구매 시</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">간편 반품</p>
                    <p className="text-xs text-gray-500">30일 이내 반품 가능</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Size Chart Image */}
        {product.sizeChartImage && (
          <div className="mt-8 sm:mt-16">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">사이즈 가이드</h2>
            <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={product.sizeChartImage}
                alt={`${product.name} 사이즈 가이드`}
                width={1200}
                unoptimized
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Description Image */}
        {product.descriptionImage && (
          <div className="mt-8 sm:mt-16">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">상품 상세</h2>
            <div className="bg-gray-100">
              <img
                src={product.descriptionImage}
                alt={`${product.name} 상세 정보`}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-16">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-6">관련 상품</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} brand={brand} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
