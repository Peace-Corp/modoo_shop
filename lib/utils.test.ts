import { describe, it, expect, vi, afterEach } from 'vitest';
import { isExpired, isLightColor, formatPrice, getStorageKey, parseDetailImages } from './utils';

describe('isExpired', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false when no date is provided', () => {
    expect(isExpired()).toBe(false);
    expect(isExpired(undefined)).toBe(false);
  });

  it('returns true for a past date', () => {
    expect(isExpired('2020-01-01')).toBe(true);
  });

  it('returns false for a future date', () => {
    expect(isExpired('2099-12-31')).toBe(false);
  });

  it('returns true when end date is exactly now', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-15T12:00:00Z'));
    expect(isExpired('2025-06-15T11:00:00Z')).toBe(true);
    expect(isExpired('2025-06-15T13:00:00Z')).toBe(false);
  });
});

describe('isLightColor', () => {
  it('returns true for white', () => {
    expect(isLightColor('#ffffff')).toBe(true);
  });

  it('returns false for black', () => {
    expect(isLightColor('#000000')).toBe(false);
  });

  it('works without # prefix', () => {
    expect(isLightColor('ffffff')).toBe(true);
    expect(isLightColor('000000')).toBe(false);
  });

  it('returns true for light gray', () => {
    expect(isLightColor('#cccccc')).toBe(true);
  });

  it('returns false for dark blue', () => {
    expect(isLightColor('#000066')).toBe(false);
  });

  it('returns true for yellow (high luminance)', () => {
    expect(isLightColor('#ffff00')).toBe(true);
  });
});

describe('formatPrice', () => {
  it('formats zero', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('formats a typical price with thousands separator', () => {
    const result = formatPrice(15000);
    expect(result).toContain('15,000');
  });

  it('formats a large price', () => {
    const result = formatPrice(1234567);
    expect(result).toContain('1,234,567');
  });
});

describe('getStorageKey', () => {
  it('returns prefixed key', () => {
    expect(getStorageKey('abc-123')).toBe('modoo_brand_cart_abc-123');
  });

  it('handles empty string', () => {
    expect(getStorageKey('')).toBe('modoo_brand_cart_');
  });
});

describe('parseDetailImages', () => {
  it('returns undefined for null/undefined/empty', () => {
    expect(parseDetailImages(null)).toBeUndefined();
    expect(parseDetailImages(undefined)).toBeUndefined();
    expect(parseDetailImages('')).toBeUndefined();
    expect(parseDetailImages(0)).toBeUndefined();
  });

  it('wraps a plain string into an array', () => {
    expect(parseDetailImages('https://img.com/photo.jpg')).toEqual([
      'https://img.com/photo.jpg',
    ]);
  });

  it('passes through a flat array of strings', () => {
    const input = ['img1.jpg', 'img2.jpg'];
    expect(parseDetailImages(input)).toEqual(['img1.jpg', 'img2.jpg']);
  });

  it('passes through a nested array (swiper groups)', () => {
    const input = [['img1.jpg', 'img2.jpg'], 'img3.jpg'];
    expect(parseDetailImages(input)).toEqual([['img1.jpg', 'img2.jpg'], 'img3.jpg']);
  });

  it('returns undefined for non-string non-array values', () => {
    expect(parseDetailImages(42)).toBeUndefined();
    expect(parseDetailImages(true)).toBeUndefined();
    expect(parseDetailImages({})).toBeUndefined();
  });
});
