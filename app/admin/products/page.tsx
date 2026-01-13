import { getProducts } from '@/data/products';
import { getBrands } from '@/data/brands';
import AdminProducts from './AdminProducts';

export default async function AdminProductsPage() {
  const [products, brands] = await Promise.all([
    getProducts(),
    getBrands(),
  ]);

  return <AdminProducts products={products} brands={brands} />;
}
