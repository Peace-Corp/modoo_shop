import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { getBrandBySlug, brands } from '@/data/brands';
import { getProductsByBrandId } from '@/data/products';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const products = getProductsByBrandId(brand.id);

  return (
    <div className="pb-8">
      {/* Brand Header */}
      <div className="relative h-64 md:h-80">
        <Image
          src={brand.banner}
          alt={brand.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto flex items-end gap-3 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-lg bg-white shrink-0">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{brand.name}</h1>
              <p className="text-xs sm:text-base text-gray-200 max-w-2xl line-clamp-2">{brand.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/brands" className="text-gray-500 hover:text-gray-700">Brands</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{brand.name}</span>
        </nav>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <p className="text-gray-600 mt-1">{products.length} products available</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600">Check back soon for new arrivals!</p>
          </div>
        )}
      </div>

      {/* Brand Story */}
      <div className="bg-gray-50 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {brand.name}</h2>
              <p className="text-gray-600 leading-relaxed">
                {brand.description} We are committed to delivering exceptional quality
                and innovative designs that elevate your lifestyle. Every product is
                crafted with care and attention to detail, ensuring you receive nothing
                but the best.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{products.length}+</p>
                  <p className="text-sm text-gray-500">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">4.8</p>
                  <p className="text-sm text-gray-500">Avg Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">10K+</p>
                  <p className="text-sm text-gray-500">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
