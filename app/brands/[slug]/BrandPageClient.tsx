'use client';

import Image from 'next/image';
import { Brand, Product } from '@/types';
import { useBrandCart } from '@/contexts/BrandCartContext';
import { BrandCartModal } from '@/components/brands/BrandCartModal';

interface BrandPageClientProps {
  brand: Brand;
  products: Product[];
}

function isExpired(validPeriodEnd?: string): boolean {
  if (!validPeriodEnd) return false;
  return new Date(validPeriodEnd) < new Date();
}

export function BrandPageClient({ brand, products }: BrandPageClientProps) {
  const { openCart } = useBrandCart();
  const expired = isExpired(brand.validPeriodEnd);

  const handleOpenCart = () => {
    if (expired) return;
    openCart(brand.id, brand.name, products);
  };

  return (
    <div className="pb-20 max-w-5xl mx-auto pt-6 space-y-10 relative">
      {/* Banner Section with centered logo */}
      <div className="relative bg-gray-200 rounded-xl overflow-hidden">
        {/* Banner wrapper with aspect ratio */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1]">
          {brand.banner ? (
            <Image
              src={brand.banner}
              alt={brand.name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">배너 이미지</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t to-40% from-black/70 to-transparent" />
        </div>

        {/* Centered Logo Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
            {brand.logo ? (
              <Image
                src={brand.logo}
                alt={brand.name}
                width={96}
                height={96}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-xs">Logo</span>
              </div>
            )}
          </div>
          <h1 className="mt-2 text-lg sm:text-xl md:text-2xl font-bold text-white">
            {brand.name}
          </h1>
        </div>
      </div>

      {/* Detail Image Section */}
      <div className="bg-gray-200 rounded-xl">
        <div className="max-w-4xl mx-auto">
          {brand.detailImage ? (
            <Image
              src={brand.detailImage}
              alt="상세정보"
              width={1200}
              height={1600}
              unoptimized
              className="w-full h-auto"
            />
          ) : (
            <div className="aspect-[3/4] flex items-center justify-center">
              <span className="text-gray-400 text-lg">상세정보 이미지</span>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleOpenCart}
            disabled={expired}
            className={`w-full py-4 font-semibold rounded-full transition-colors text-lg ${
              expired
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {expired ? '판매 기간 종료' : '구매하기'}
          </button>
        </div>
      </div>

      {/* Expired Period Overlay */}
      {expired && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">판매 기간 종료</h2>
            <p className="text-gray-500 mb-6">
              이 브랜드의 판매 기간이 종료되었습니다.
            </p>
            <a
              href="/"
              className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-colors"
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      <BrandCartModal />
    </div>
  );
}
