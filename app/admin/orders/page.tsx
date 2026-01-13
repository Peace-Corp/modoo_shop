import { getOrders } from '@/data/users';
import AdminOrders from './AdminOrders';

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrders orders={orders} />;
}
