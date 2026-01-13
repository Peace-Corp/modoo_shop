import { User, Order, SalesData, DashboardStats, Address } from '@/types';
import { createServerClient } from '@/lib/supabase';
import { Tables } from '@/lib/database.types';

type ProfileRow = Tables<'profiles'>;
type OrderRow = Tables<'orders'>;
type SalesDataRow = Tables<'sales_data'>;
type AddressRow = Tables<'addresses'>;

// Fetch all users (admin only - uses service role)
export async function getUsers(): Promise<User[]> {
  const supabase = createServerClient();

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Error fetching users:', profilesError);
    return [];
  }

  // Fetch addresses for each user
  const { data: addresses, error: addressesError } = await supabase
    .from('addresses')
    .select('*')
    .eq('is_default', true);

  if (addressesError) {
    console.error('Error fetching addresses:', addressesError);
  }

  const addressMap = new Map<string, AddressRow>();
  addresses?.forEach(addr => addressMap.set(addr.user_id, addr));

  return profiles.map(profile => mapUserFromDb(profile, addressMap.get(profile.id)));
}

// Get user by ID
export async function getUserById(id: string): Promise<User | undefined> {
  const supabase = createServerClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (profileError) {
    console.error('Error fetching user by id:', profileError);
    return undefined;
  }

  const { data: address } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', id)
    .eq('is_default', true)
    .single();

  return mapUserFromDb(profile, address ?? undefined);
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const supabase = createServerClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user by email:', error);
    return undefined;
  }

  const { data: address } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_default', true)
    .single();

  return mapUserFromDb(profile, address ?? undefined);
}

// Fetch all orders (admin only)
export async function getOrders(): Promise<Order[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data.map(mapOrderFromDb);
}

// Fetch sales data (admin only)
export async function getSalesData(): Promise<SalesData[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('sales_data')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching sales data:', error);
    return [];
  }

  return data.map(mapSalesDataFromDb);
}

// Get dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServerClient();

  // Fetch all data in parallel
  const [salesDataResult, ordersResult, productsResult, usersResult] = await Promise.all([
    supabase.from('sales_data').select('*').order('date', { ascending: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
  ]);

  const salesData = (salesDataResult.data ?? []).map(mapSalesDataFromDb);
  const recentOrders = (ordersResult.data ?? []).map(mapOrderFromDb);
  const totalProducts = productsResult.count ?? 0;
  const totalUsers = usersResult.count ?? 0;

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    recentOrders,
    salesData,
  };
}

// Map database row to User type
function mapUserFromDb(row: ProfileRow, address?: AddressRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatar: row.avatar ?? undefined,
    role: row.role as 'user' | 'admin',
    createdAt: row.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    address: address ? mapAddressFromDb(address) : undefined,
  };
}

// Map database row to Address type
function mapAddressFromDb(row: AddressRow): Address {
  return {
    street: row.street,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    country: row.country,
    phone: row.phone,
  };
}

// Map database row to Order type
function mapOrderFromDb(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    items: [], // Order items would need to be fetched separately if needed
    total: row.total,
    status: row.status as Order['status'],
    paymentMethod: row.payment_method as Order['paymentMethod'],
    paymentStatus: row.payment_status as Order['paymentStatus'],
    shippingAddress: {
      street: row.shipping_street,
      city: row.shipping_city,
      state: row.shipping_state,
      zipCode: row.shipping_zip_code,
      country: row.shipping_country,
      phone: row.shipping_phone,
    },
    createdAt: row.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    updatedAt: row.updated_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
  };
}

// Map database row to SalesData type
function mapSalesDataFromDb(row: SalesDataRow): SalesData {
  return {
    date: row.date,
    revenue: Number(row.revenue),
    orders: row.orders,
  };
}
