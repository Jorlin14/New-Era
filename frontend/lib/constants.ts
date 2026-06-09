
export const BRAND = {
    green: '#1c6554',
} as const;

export const FREE_SHIPPING_THRESHOLD = 50_000;

export const STANDARD_SHIPPING_COST = 5_000;

export const CART_STORAGE_KEY = 'new-era-cart';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const DEFAULT_CATEGORY_EMOJI = '📦';

export function getCategoryEmoji(categoryId: string): string {
  return DEFAULT_CATEGORY_EMOJI;
}
