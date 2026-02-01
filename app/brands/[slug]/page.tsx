import { notFound } from 'next/navigation';
import { getBrandBySlug, getBrands } from '@/data/brands';
import { getProductsByBrandIdWithVariants } from '@/data/products';
import { BrandPageClient } from './BrandPageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return { title: 'Brand Not Found | 모두굿즈' };
  }

  return {
    title: `${brand.name} | 모두굿즈`,
  };
}

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const products = await getProductsByBrandIdWithVariants(brand.id);

  return <BrandPageClient brand={brand} products={products} />;
}
