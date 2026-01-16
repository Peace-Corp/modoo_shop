import { HeroBanner } from '@/types';
import { supabase } from '@/lib/supabase';

interface HeroBannerRow {
  id: string;
  title: string;
  subtitle: string | null;
  link: string | null;
  tags: string[] | null;
  display_order: number | null;
  image_link: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching hero banners:', error);
    return [];
  }

  return data.map(mapHeroBannerFromDb);
}

export async function getFirstHeroBanner(): Promise<HeroBanner | null> {
  const { data, error } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching hero banner:', error);
    return null;
  }

  return mapHeroBannerFromDb(data);
}

function mapHeroBannerFromDb(row: HeroBannerRow): HeroBanner {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    link: row.link ?? undefined,
    tags: row.tags ?? [],
    displayOrder: row.display_order ?? 0,
    imageLink: row.image_link,
  };
}