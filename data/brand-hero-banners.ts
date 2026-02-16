import { BrandHeroBanner } from '@/types';
import { supabase } from '@/lib/supabase';

interface BrandHeroBannerRow {
  id: string;
  brand_id: string;
  title: string;
  subtitle: string | null;
  link: string | null;
  color: string | null;
  display_order: number | null;
  image_link: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function getBrandHeroBanners(brandId: string): Promise<BrandHeroBanner[]> {
  const { data, error } = await supabase
    .from('brand_hero_banners')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching brand hero banners:', error);
    return [];
  }

  return data.map(mapBrandHeroBannerFromDb);
}

export async function getFirstBrandHeroBanner(brandId: string): Promise<BrandHeroBanner | null> {
  const { data, error } = await supabase
    .from('brand_hero_banners')
    .select('*')
    .eq('brand_id', brandId)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching brand hero banner:', error);
    return null;
  }

  return mapBrandHeroBannerFromDb(data);
}

function mapBrandHeroBannerFromDb(row: BrandHeroBannerRow): BrandHeroBanner {
  return {
    id: row.id,
    brandId: row.brand_id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    link: row.link ?? undefined,
    color: row.color ?? undefined,
    displayOrder: row.display_order ?? 0,
    imageLink: row.image_link,
  };
}
