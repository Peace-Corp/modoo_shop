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
      className="flex flex-col items-center w-fit"
    >
      <div className='size-28 rounded-full shadow-sm overflow-hidden hover:shadow-lg'>
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
