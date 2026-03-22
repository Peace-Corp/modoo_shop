export function isExpired(validPeriodEnd?: string): boolean {
  if (!validPeriodEnd) return false;
  return new Date(validPeriodEnd) < new Date();
}

export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
}

export function getStorageKey(brandId: string): string {
  return `modoo_brand_cart_${brandId}`;
}

export function parseDetailImages(raw: unknown): (string | string[])[] | undefined {
  if (!raw) return undefined;
  if (typeof raw === 'string') return [raw];
  if (Array.isArray(raw)) return raw as (string | string[])[];
  return undefined;
}
