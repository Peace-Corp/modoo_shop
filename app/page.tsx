import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { BrandCard } from '@/components/brands/BrandCard';
import { HeroBanner } from '@/components/home/HeroBanner';
import { getFeaturedProducts } from '@/data/products';
import { getFeaturedBrands, getBrands } from '@/data/brands';

export default async function HomePage() {
  const [featuredProducts, featuredBrands, allBrands] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedBrands(),
    getBrands(),
  ]);

  // Create brand lookup map
  const brandMap = new Map(allBrands.map(b => [b.id, b]));

  return (
    <div className='max-w-300 mx-auto'>
      {/* Hero Section */}
      <HeroBanner />

      {/* Featured Products - 추천 상품을 브랜드보다 위로 이동 */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">추천 상품</h2>
              <p className="mt-2 text-gray-600">엄선된 인기 상품을 만나보세요</p>
            </div>
            <Link
              href="/search"
              className="text-[#0052cc] font-medium hover:underline flex items-center"
            >
              전체보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} brand={brandMap.get(product.brandId)} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">입점 브랜드</h2>
              <p className="mt-2 text-gray-600">감성 가득한 브랜드들을 만나보세요</p>
            </div>
            <Link
              href="/brands"
              className="text-[#0052cc] font-medium hover:underline flex items-center"
            >
              전체보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="flex gap-6">
            {featuredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
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
