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
  brandColor?: string;
  detailImages?: (string | string[])[];
  description: string;
  featured?: boolean;
  validPeriodStart?: string;
  validPeriodEnd?: string;
  deliveryDomesticEnabled?: boolean;
  deliveryDomesticPrice?: number;
  deliveryInternationalEnabled?: boolean;
  deliveryInternationalPrice?: number;
  deliveryPickupEnabled?: boolean;
  deliveryPickupPrice?: number;
  deliveryPickupAddress?: string;
}

// Brand Delivery Options (for checkout sessionStorage)
export interface BrandDeliveryOptions {
  domestic: { enabled: boolean; price: number } | null;
  international: { enabled: boolean; price: number } | null;
  pickup: { enabled: boolean; price: number; address: string } | null;
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

// Brand Cart Types (for brand-specific cart modal)
export interface BrandCartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface BrandCart {
  brandId: string;
  brandName: string;
  items: BrandCartItem[];
}

// Order Types
export interface Order {
  id: string;
  userId: string | null;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'toss' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryMethod: 'domestic' | 'international' | 'pickup';
  shippingCost: number;
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

// Brand Hero Banner Types
export interface BrandHeroBanner {
  id: string;
  brandId: string;
  title: string;
  subtitle?: string;
  link?: string;
  color?: string;
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
