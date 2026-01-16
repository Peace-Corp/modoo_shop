import { Product, ProductVariant } from '@/types';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/database.types';

type ProductRow = Tables<'products'>;

interface VariantRow {
  id: string;
  product_id: string;
  size: string;
  stock: number;
  sort_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

// Fetch all products from Supabase
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(mapProductFromDb);
}

// Get product by ID (with variants)
export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by id:', error);
    return undefined;
  }

  const variants = (data.product_variants as VariantRow[] | undefined)?.map(mapVariantFromDb) ?? [];
  return {
    ...mapProductFromDb(data),
    variants: variants.sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

// Get products by brand ID
export async function getProductsByBrandId(brandId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by brand:', error);
    return [];
  }

  return data.map(mapProductFromDb);
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data.map(mapProductFromDb);
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const lowerQuery = query.toLowerCase();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%,category.ilike.%${lowerQuery}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  // Also filter by tags (done client-side since Supabase array contains is exact match)
  return data
    .filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      (product.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ?? false)
    )
    .map(mapProductFromDb);
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data.map(mapProductFromDb);
}

// Get all unique categories
export async function getAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return [...new Set(data.map(p => p.category))];
}

// Map database row to Product type
function mapProductFromDb(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    images: row.images,
    brandId: row.brand_id,
    category: row.category,
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    tags: row.tags ?? [],
    createdAt: row.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    featured: row.featured ?? false,
    sizeChartImage: row.size_chart_image ?? undefined,
    descriptionImage: row.description_image ?? undefined,
  };
}

// Map database row to ProductVariant type
function mapVariantFromDb(row: VariantRow): ProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    size: row.size,
    stock: row.stock,
    sortOrder: row.sort_order,
  };
}
