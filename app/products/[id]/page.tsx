import { notFound } from 'next/navigation';
import { getProductById, getProductsByBrandId, getProducts } from '@/data/products';
import { getBrandById } from '@/data/brands';
import ProductDetail from './ProductDetail';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const [brand, allBrandProducts] = await Promise.all([
    getBrandById(product.brandId),
    getProductsByBrandId(product.brandId),
  ]);

  const relatedProducts = allBrandProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetail
      product={product}
      brand={brand}
      relatedProducts={relatedProducts}
    />
  );
}
