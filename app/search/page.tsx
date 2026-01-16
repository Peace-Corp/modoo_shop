import { Suspense } from 'react';
import SearchContent from './SearchContent';
import { getProducts, getAllCategories } from '@/data/products';
import { getBrands } from '@/data/brands';

function SearchFallback() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Products</h1>
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 flex-shrink-0">
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function SearchPage() {
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getAllCategories(),
  ]);

  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent
        initialProducts={products}
        brands={brands}
        categories={categories}
      />
    </Suspense>
  );
}
