import { User, Order, SalesData, DashboardStats } from '@/types';

export const users: User[] = [
  {
    id: 'user-1',
    email: 'admin@modoo.shop',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  },
  {
    id: 'user-2',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1-555-0101',
    },
  },
  {
    id: 'user-3',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    role: 'user',
    createdAt: '2024-01-20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      phone: '+1-555-0102',
    },
  },
  {
    id: 'user-4',
    email: 'mike@example.com',
    name: 'Mike Wilson',
    role: 'user',
    createdAt: '2024-02-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: 'user-5',
    email: 'emma@example.com',
    name: 'Emma Davis',
    role: 'user',
    createdAt: '2024-02-05',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

export const orders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-2',
    items: [],
    total: 649.98,
    status: 'delivered',
    paymentMethod: 'toss',
    paymentStatus: 'completed',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1-555-0101',
    },
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
  },
  {
    id: 'order-2',
    userId: 'user-3',
    items: [],
    total: 429.98,
    status: 'shipped',
    paymentMethod: 'paypal',
    paymentStatus: 'completed',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      phone: '+1-555-0102',
    },
    createdAt: '2024-02-08',
    updatedAt: '2024-02-10',
  },
  {
    id: 'order-3',
    userId: 'user-2',
    items: [],
    total: 189.99,
    status: 'processing',
    paymentMethod: 'toss',
    paymentStatus: 'completed',
    shippingAddress: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '+1-555-0101',
    },
    createdAt: '2024-02-12',
    updatedAt: '2024-02-12',
  },
  {
    id: 'order-4',
    userId: 'user-4',
    items: [],
    total: 549.99,
    status: 'pending',
    paymentMethod: 'paypal',
    paymentStatus: 'pending',
    shippingAddress: {
      street: '789 Pine Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      phone: '+1-555-0103',
    },
    createdAt: '2024-02-14',
    updatedAt: '2024-02-14',
  },
];

export const salesData: SalesData[] = [
  { date: '2024-02-01', revenue: 2450.50, orders: 8 },
  { date: '2024-02-02', revenue: 1890.00, orders: 6 },
  { date: '2024-02-03', revenue: 3200.75, orders: 12 },
  { date: '2024-02-04', revenue: 2780.25, orders: 9 },
  { date: '2024-02-05', revenue: 4100.00, orders: 15 },
  { date: '2024-02-06', revenue: 3560.50, orders: 11 },
  { date: '2024-02-07', revenue: 2950.00, orders: 10 },
  { date: '2024-02-08', revenue: 4500.25, orders: 16 },
  { date: '2024-02-09', revenue: 3890.75, orders: 13 },
  { date: '2024-02-10', revenue: 5200.00, orders: 18 },
  { date: '2024-02-11', revenue: 4750.50, orders: 17 },
  { date: '2024-02-12', revenue: 3980.25, orders: 14 },
  { date: '2024-02-13', revenue: 4200.00, orders: 15 },
  { date: '2024-02-14', revenue: 5500.75, orders: 20 },
];

export const getDashboardStats = (): DashboardStats => {
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);

  return {
    totalRevenue,
    totalOrders,
    totalProducts: 20,
    totalUsers: users.filter(u => u.role === 'user').length,
    recentOrders: orders.slice(0, 5),
    salesData,
  };
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};
