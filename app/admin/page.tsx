import { getDashboardStats } from '@/data/users';
import { getProducts } from '@/data/products';
import { getBrands } from '@/data/brands';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const [stats, products, brands] = await Promise.all([
    getDashboardStats(),
    getProducts(),
    getBrands(),
  ]);

  return (
    <AdminDashboard
      stats={stats}
      products={products}
      brands={brands}
    />
  );
}
