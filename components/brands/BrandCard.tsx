'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/types';

interface BrandCardProps {
  brand: Brand;
  variant?: 'small' | 'large';
}

export function BrandCard({ brand, variant = 'small' }: BrandCardProps) {
  if (variant === 'large') {
    return (
      <Link
        href={`/brands/${brand.slug}`}
        className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className="size-16 md:size-20 rounded-full overflow-hidden shrink-0">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-semibold text-black/90 text-lg">{brand.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{brand.description}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="flex flex-col items-center w-fit"
    >
      <div className="size-28 rounded-full shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={112}
          height={112}
          className="object-cover w-full h-full"
        />
      </div>
      <h3 className="font-semibold text-black/90 text-lg">{brand.name}</h3>
    </Link>
  );
}
