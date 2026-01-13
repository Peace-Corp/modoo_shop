import { getBrands } from '@/data/brands';
import { getProducts } from '@/data/products';
import AdminBrands from './AdminBrands';

export default async function AdminBrandsPage() {
  const [brands, products] = await Promise.all([
    getBrands(),
    getProducts(),
  ]);

  return <AdminBrands brands={brands} products={products} />;
}
