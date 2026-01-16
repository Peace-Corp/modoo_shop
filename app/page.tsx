import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { BrandCard } from '@/components/brands/BrandCard';
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
    <div>
      {/* Hero Section */}
      <section className="relative aspect-4/3 sm:aspect-video md:aspect-21/9 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/hero_banner_image.png"
            alt="히어로 배경"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="relative max-w-7xl px-10 sm:px-10 lg:px-10 z-10">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-[#0052cc] text-white text-xs md:text-sm font-medium rounded-full mb-4 md:mb-6">
              신상품
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              유메키샵 신상<br />
            </h1>
            <p className="text-sm md:text-lg text-gray-200 mb-4 md:mb-8">
              댄서 유메키의 신상 공식 굿즈를 만나보세요.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link
                href="https://www.youmakeit.shop"
                className="inline-flex items-center px-5 py-2.5 md:px-8 md:py-4 bg-[#0052cc] text-white text-sm md:text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                구매하러 가기
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - 추천 상품을 브랜드보다 위로 이동 */}
      <section className="py-10 bg-white">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} brand={brandMap.get(product.brandId)} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-10 bg-gray-50">
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
