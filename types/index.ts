// Product Variant Types
export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  stock: number;
  sortOrder: number;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brandId: string;
  category: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  featured?: boolean;
  variants?: ProductVariant[];
  sizeChartImage?: string;
  descriptionImage?: string;
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  eng_name?: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  featured?: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string | null;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'toss' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

// Hero Banner Types
export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  tags: string[];
  displayOrder: number;
  imageLink: string;
}

// Admin Dashboard Types
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  salesData: SalesData[];
}
