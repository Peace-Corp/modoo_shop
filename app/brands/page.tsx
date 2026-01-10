import { BrandCard } from '@/components/brands/BrandCard';
import { brands } from '@/data/brands';

export default function BrandsPage() {
  return (
    <div className="py-8">
      {/* Header */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">입점 브랜드</h1>
          <p className="text-black/40 max-w-2xl mx-auto">
            엄선된 프리미엄 브랜드들을 만나보세요.
            품질, 스타일, 고객 만족을 최우선으로 선정했습니다.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Brands */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 브랜드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.filter(b => b.featured).map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        {/* All Brands */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">전체 브랜드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        {/* Brand Benefits */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">모두의 샵 브랜드의 특별함</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% 정품 보장</h3>
              <p className="text-gray-600 text-sm">모든 상품은 브랜드 파트너사에서 직접 공급받은 정품입니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">합리적인 가격</h3>
              <p className="text-gray-600 text-sm">다른 곳에서 찾기 어려운 특별한 가격과 혜택을 제공합니다.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">프리미엄 품질</h3>
              <p className="text-gray-600 text-sm">엄격한 품질 기준을 통과한 브랜드만 선별하여 소개합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
