import { Brand } from '@/types';

export const brands: Brand[] = [
  {
    id: 'brand-1',
    name: '유메키샵',
    slug: 'yumeki-shop',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=400&fit=crop',
    description: '일본 감성의 유니크한 패션 아이템을 만나보세요. 트렌디하고 감각적인 스타일을 제안합니다.',
    featured: true,
  },
  {
    id: 'brand-2',
    name: '사람의탈',
    slug: 'sarameui-tal',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=400&fit=crop',
    description: '한국 전통의 멋과 현대적 감각이 어우러진 의류 브랜드. 독특한 디자인으로 개성을 표현하세요.',
    featured: true,
  },
  {
    id: 'brand-3',
    name: '눙눙이의 겨울',
    slug: 'nungnungi-winter',
    logo: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1600&h=400&fit=crop',
    description: '따뜻하고 포근한 겨울 아이템 전문 브랜드. 귀여운 디자인과 최고의 보온성을 자랑합니다.',
    featured: true,
  },
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
