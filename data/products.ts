import { Product } from '@/types';

export const products: Product[] = [
  // 유미키샵 상품
  {
    id: '896c3bef-0a32-4dbf-8bad-fb41fe2f874c',
    name: '티셔츠',
    description: 'T-shirt. 사이즈: S, M, L',
    price: 35000,
    images: [
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/tshirt_front.png',
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/tshirt_back.png',
    ],
    brandId: 'brand-1',
    category: '상의',
    stock: 49,
    rating: 4.8,
    reviewCount: 124,
    tags: ['티셔츠', 'S', 'M', 'L'],
    createdAt: '2025-10-31',
    featured: true,
  },
  {
    id: 'ad4a921f-a228-4f2f-8068-6c2fea5b241a',
    name: '후드집업 (그레이)',
    description: 'Zipup Hoodie (Gray). 사이즈: S, M, L',
    price: 70000,
    images: [
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/zipup_mockup.png',
    ],
    brandId: 'brand-1',
    category: '아우터',
    stock: 0,
    rating: 4.7,
    reviewCount: 45,
    tags: ['후드집업', '그레이', 'S', 'M', 'L'],
    createdAt: '2026-01-10',
    featured: true,
  },
  {
    id: '3acdc3cb-ab1d-4e33-9afc-c240897dbc40',
    name: '후드집업 (블랙)',
    description: 'Zipup Hoodie (Black). 사이즈: S, M, L',
    price: 70000,
    images: [
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/zipup_mockup.png',
    ],
    brandId: 'brand-1',
    category: '아우터',
    stock: 0,
    rating: 4.7,
    reviewCount: 38,
    tags: ['후드집업', '블랙', 'S', 'M', 'L'],
    createdAt: '2026-01-10',
    featured: true,
  },
  {
    id: '26003ece-dea6-44aa-8a57-99c4ff779f3e',
    name: '후드티',
    description: 'Hoodie. 사이즈: M, L',
    price: 65000,
    images: [
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/hoodie_front.png',
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/hoodie_back.png',
    ],
    brandId: 'brand-1',
    category: '상의',
    stock: 51,
    rating: 4.9,
    reviewCount: 89,
    tags: ['후드티', 'M', 'L'],
    createdAt: '2025-10-31',
    featured: true,
  },
  {
    id: '39fb4008-21bb-4276-a8bc-b6530382faba',
    name: '아크릴 스탠드',
    description: 'Acryl Stand',
    price: 20000,
    images: [
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/acryl_stand.png',
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/acryl_size.png',
    ],
    brandId: 'brand-1',
    category: '액세서리',
    stock: 16,
    rating: 4.8,
    reviewCount: 156,
    tags: ['아크릴', '스탠드', '굿즈'],
    createdAt: '2025-10-31',
    featured: true,
  },
  {
    id: '0ebc799b-db23-4e70-8fc1-c79344898151',
    name: '아크릴 키링',
    description: 'Acryl Keyring. 옵션: Love it, Miss Me',
    price: 12000,
    images: [
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/keyring_thumbnail.png',
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/keyring_two.png',
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/keyring_size.png',
    ],
    brandId: 'brand-1',
    category: '액세서리',
    stock: 53,
    rating: 4.9,
    reviewCount: 234,
    tags: ['아크릴', '키링', '굿즈', 'Love it', 'Miss Me'],
    createdAt: '2025-10-31',
    featured: true,
  },
  {
    id: '71dbc2d8-3a2c-4fff-8a35-ed4eedf3244d',
    name: '포토카드',
    description: 'Photocard',
    price: 5000,
    images: [
      'https://xwuvbztgpwhbwohontuh.supabase.co/storage/v1/object/public/umeki_products/photocard_thumbnail.png',
    ],
    brandId: 'brand-1',
    category: '액세서리',
    stock: 67,
    rating: 4.8,
    reviewCount: 312,
    tags: ['포토카드', '굿즈'],
    createdAt: '2025-10-31',
    featured: true,
  },

  // 사람의탈 상품 (한국 전통 모던 의류)
  {
    id: 'prod-5',
    name: '모던 저고리 자켓',
    description: '한복의 저고리를 현대적으로 재해석한 자켓. 캐주얼하게도 포멀하게도 연출 가능합니다.',
    price: 159000,
    originalPrice: 199000,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-2',
    category: '아우터',
    stock: 20,
    rating: 4.9,
    reviewCount: 156,
    tags: ['한복', '자켓', '모던'],
    createdAt: '2024-02-01',
  },
  {
    id: 'prod-6',
    name: '생활한복 바지',
    description: '편안한 착용감의 생활한복 바지. 전통의 아름다움과 현대의 실용성을 겸비했습니다.',
    price: 89000,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-2',
    category: '하의',
    stock: 35,
    rating: 4.8,
    reviewCount: 98,
    tags: ['생활한복', '바지', '전통'],
    createdAt: '2024-01-25',
  },
  {
    id: 'prod-7',
    name: '자수 포인트 셔츠',
    description: '전통 자수 패턴이 포인트인 셔츠. 은은한 멋을 더해주는 아이템입니다.',
    price: 75000,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-2',
    category: '상의',
    stock: 45,
    rating: 4.7,
    reviewCount: 67,
    tags: ['자수', '셔츠', '포인트'],
    createdAt: '2024-02-08',
  },
  {
    id: 'prod-8',
    name: '매듭 노리개 액세서리',
    description: '전통 매듭 기법으로 제작한 노리개 액세서리. 가방이나 열쇠에 포인트로 활용하세요.',
    price: 35000,
    originalPrice: 45000,
    images: [
      'https://images.unsplash.com/photo-1611923134239-b9be5b4d1b42?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-2',
    category: '액세서리',
    stock: 100,
    rating: 4.9,
    reviewCount: 234,
    tags: ['매듭', '노리개', '액세서리'],
    createdAt: '2024-01-18',
  },

  // 눙눙이의 겨울 상품 (겨울 아이템)
  {
    id: 'prod-9',
    name: '푹신푹신 패딩 점퍼',
    description: '가볍고 따뜻한 구스다운 패딩. 귀여운 디자인과 최고의 보온성을 자랑합니다.',
    price: 189000,
    originalPrice: 249000,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd628b8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-3',
    category: '아우터',
    stock: 30,
    rating: 4.9,
    reviewCount: 312,
    tags: ['패딩', '겨울', '따뜻한'],
    createdAt: '2024-02-08',
  },
  {
    id: 'prod-10',
    name: '양털 후리스 집업',
    description: '포근한 양털 소재의 후리스 집업. 집에서도 외출시에도 편안하게 착용하세요.',
    price: 79000,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-3',
    category: '아우터',
    stock: 50,
    rating: 4.8,
    reviewCount: 178,
    tags: ['후리스', '양털', '집업'],
    createdAt: '2024-01-28',
  },
  {
    id: 'prod-11',
    name: '니트 머플러 세트',
    description: '부드러운 캐시미어 혼방 니트 머플러와 장갑 세트. 따뜻함과 스타일을 동시에.',
    price: 55000,
    originalPrice: 75000,
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-3',
    category: '액세서리',
    stock: 80,
    rating: 4.7,
    reviewCount: 145,
    tags: ['머플러', '장갑', '니트'],
    createdAt: '2024-02-12',
  },
  {
    id: 'prod-12',
    name: '기모 맨투맨',
    description: '안감 기모 처리로 더욱 따뜻한 맨투맨. 귀여운 캐릭터 프린팅이 포인트.',
    price: 49000,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-3',
    category: '상의',
    stock: 60,
    rating: 4.6,
    reviewCount: 89,
    tags: ['기모', '맨투맨', '겨울'],
    createdAt: '2024-01-22',
  },
  {
    id: 'prod-13',
    name: '털방울 비니',
    description: '귀여운 털방울이 달린 따뜻한 비니. 다양한 컬러로 코디하기 좋아요.',
    price: 29000,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-3',
    category: '모자',
    stock: 100,
    rating: 4.8,
    reviewCount: 267,
    tags: ['비니', '모자', '겨울'],
    createdAt: '2024-02-03',
  },
  {
    id: 'prod-14',
    name: '눙눙이 수면양말',
    description: '푹신푹신한 수면양말. 귀여운 눙눙이 캐릭터로 발을 따뜻하게 지켜줍니다.',
    price: 15000,
    originalPrice: 19000,
    images: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=600&fit=crop',
    ],
    brandId: 'brand-3',
    category: '양말',
    stock: 200,
    rating: 4.9,
    reviewCount: 456,
    tags: ['수면양말', '양말', '겨울'],
    createdAt: '2024-02-07',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByBrandId = (brandId: string): Product[] => {
  return products.filter(product => product.brandId === brandId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const getAllCategories = (): string[] => {
  return [...new Set(products.map(product => product.category))];
};
