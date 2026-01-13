import { getBrands } from '@/data/brands';
import CartContent from './CartContent';

export default async function CartPage() {
  const brands = await getBrands();
  return <CartContent brands={brands} />;
}
