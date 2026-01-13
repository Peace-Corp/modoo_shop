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

// Get featured brands
export async function getFeaturedBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured brands:', error);
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
  description: string;
  featured: boolean | null;
}): Brand {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logo: row.logo,
    banner: row.banner,
    description: row.description,
    featured: row.featured ?? false,
  };
}
