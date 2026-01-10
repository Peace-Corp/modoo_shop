import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/products/ProductCard';
import { BrandCard } from '@/components/brands/BrandCard';
import { getFeaturedProducts } from '@/data/products';
import { getFeaturedBrands } from '@/data/brands';

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const featuredBrands = getFeaturedBrands();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
            alt="히어로 배경"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 bg-indigo-600/90 text-white text-sm font-medium rounded-full mb-6">
              신상품 컬렉션
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              특별한 브랜드<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                특별한 상품
              </span>
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              유메키샵, 사람의탈, 눙눙이의 겨울까지.
              감성 가득한 브랜드들의 특별한 상품을 만나보세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/brands"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                브랜드 둘러보기
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                상품 검색하기
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
              className="text-indigo-600 font-medium hover:underline flex items-center"
            >
              전체보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
              className="text-indigo-600 font-medium hover:underline flex items-center"
            >
              전체보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
