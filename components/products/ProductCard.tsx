import Image from 'next/image';
import Link from 'next/link';
import { Product, Brand } from '@/types';

interface ProductCardProps {
  product: Product;
  brand?: Brand;
}

export function ProductCard({ product, brand }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href="https://youmakeit.shop"
      target="_blank"
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
        {/* <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white shadow-lg"
        >
          장바구니 담기
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
  );
}
