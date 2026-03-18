import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { BrandCard } from '@/components/brands/BrandCard';
import { HeroBanner } from '@/components/home/HeroBanner';
import { getFeaturedProducts } from '@/data/products';
import { getActiveBrands, getBrands } from '@/data/brands';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredProducts, activeBrands, allBrands] = await Promise.all([
    getFeaturedProducts(),
    getActiveBrands(),
    getBrands(),
  ]);

  // Create brand lookup map
  const brandMap = new Map(allBrands.map(b => [b.id, b]));

  return (
    <div className='max-w-300 mx-auto space-y-4 sm:space-y-6 md:space-y-10 pb-4 sm:pb-6 md:pb-10'>
      {/* Hero Section */}
      <HeroBanner />

      {/* Active Brands */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex justify-between items-end mb-4 sm:mb-6 md:mb-10">
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">입점 브랜드</h2>
              <p className="mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base text-gray-600">감성 가득한 브랜드들을 만나보세요</p>
            </div>
            <Link
              href="/brands"
              className="text-[#0052cc] text-xs sm:text-sm md:text-base font-medium hover:underline flex items-center"
            >
              전체보기
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2">
            {activeBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex justify-between items-end mb-4 sm:mb-6 md:mb-10">
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">추천 상품</h2>
              <p className="mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base text-gray-600">엄선된 인기 상품을 만나보세요</p>
            </div>
            <Link
              href="/search"
              className="text-[#0052cc] text-xs sm:text-sm md:text-base font-medium hover:underline flex items-center"
            >
              전체보기
              <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} brand={brandMap.get(product.brandId)} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      {/* <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: '무료 배송', desc: '5만원 이상 구매 시' },
              { icon: '🔒', title: '안전한 결제', desc: '100% 안전한 결제 시스템' },
              { icon: '↩️', title: '쉬운 반품', desc: '30일 이내 반품 가능' },
              { icon: '💬', title: '고객 지원', desc: '친절한 상담 서비스' },
            ].map((badge) => (
              <div key={badge.title} className="text-center">
                <span className="text-3xl mb-2 block">{badge.icon}</span>
                <h3 className="font-semibold text-gray-900">{badge.title}</h3>
                <p className="text-sm text-gray-500">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}
