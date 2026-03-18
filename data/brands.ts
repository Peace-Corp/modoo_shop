import { Brand } from '@/types';
import { supabase } from '@/lib/supabase';

// Fetch all brands from Supabase
export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return data.map(mapBrandFromDb);
}

// Get brand by ID
export async function getBrandById(id: string): Promise<Brand | undefined> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching brand by id:', error);
    return undefined;
  }

  return mapBrandFromDb(data);
}

// Get brand by slug
export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching brand by slug:', error);
    return undefined;
  }

  return mapBrandFromDb(data);
}

// Get featured brands (only those within valid period)
export async function getFeaturedBrands(): Promise<Brand[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('featured', true)
    .or(`valid_period_end.is.null,valid_period_end.gt.${now}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured brands:', error);
    return [];
  }

  return data.map(mapBrandFromDb);
}

// Get all brands within valid period (not expired)
export async function getActiveBrands(): Promise<Brand[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .or(`valid_period_end.is.null,valid_period_end.gt.${now}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active brands:', error);
    return [];
  }

  return data.map(mapBrandFromDb);
}

// Map database row to Brand type
function mapBrandFromDb(row: {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  brand_color?: string | null;
  detail_image?: string | null;
  description: string;
  featured: boolean | null;
  valid_period_start?: string | null;
  valid_period_end?: string | null;
  delivery_domestic_enabled?: boolean | null;
  delivery_domestic_price?: number | null;
  delivery_international_enabled?: boolean | null;
  delivery_international_price?: number | null;
  delivery_pickup_enabled?: boolean | null;
  delivery_pickup_price?: number | null;
  delivery_pickup_address?: string | null;
}): Brand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo,
    banner: row.banner,
    brandColor: row.brand_color ?? undefined,
    detailImage: row.detail_image ?? undefined,
    description: row.description,
    featured: row.featured ?? false,
    validPeriodStart: row.valid_period_start ?? undefined,
    validPeriodEnd: row.valid_period_end ?? undefined,
    deliveryDomesticEnabled: row.delivery_domestic_enabled ?? true,
    deliveryDomesticPrice: row.delivery_domestic_price ?? 3000,
    deliveryInternationalEnabled: row.delivery_international_enabled ?? false,
    deliveryInternationalPrice: row.delivery_international_price ?? 15000,
    deliveryPickupEnabled: row.delivery_pickup_enabled ?? false,
    deliveryPickupPrice: row.delivery_pickup_price ?? 0,
    deliveryPickupAddress: row.delivery_pickup_address ?? undefined,
  };
}
