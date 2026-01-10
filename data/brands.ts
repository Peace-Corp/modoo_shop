import { Brand } from '@/types';

export const brands: Brand[] = [
  {
    id: 'brand-1',
    name: '유메키샵',
    slug: 'yumeki',
    logo: 'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/yumeki_logo.png',
    banner: 'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/yumki_cover_banner.png',
    description: '댄서 유메키의 공식 굿즈샵입니다. 유메키와 함께하는 특별한 아이템을 만나보세요.',
    featured: true,
  },
  // {
  //   id: 'brand-2',
  //   name: '사람의탈',
  //   slug: 'mask',
  //   logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop',
  //   banner: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=400&fit=crop',
  //   description: '한국 전통의 멋과 현대적 감각이 어우러진 의류 브랜드. 독특한 디자인으로 개성을 표현하세요.',
  // },
  // {
  //   id: 'brand-3',
  //   name: '눙눙이의 겨울',
  //   slug: 'nungnungi-winter',
  //   logo: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=200&fit=crop',
  //   banner: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1600&h=400&fit=crop',
  //   description: '따뜻하고 포근한 겨울 아이템 전문 브랜드. 귀여운 디자인과 최고의 보온성을 자랑합니다.',
  // },
];

export const getBrandById = (id: string): Brand | undefined => {
  return brands.find(brand => brand.id === id);
};

export const getBrandBySlug = (slug: string): Brand | undefined => {
  return brands.find(brand => brand.slug === slug);
};

export const getFeaturedBrands = (): Brand[] => {
  return brands.filter(brand => brand.featured);
};
