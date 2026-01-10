'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/types';

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative h-32 overflow-hidden bg-gray-100">
        <Image
          src={brand.banner}
          alt={brand.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="font-bold text-white text-lg">{brand.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">{brand.description}</p>
        <div className="mt-3 flex items-center text-indigo-600 font-medium text-sm group-hover:underline">
          쇼핑하기
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
