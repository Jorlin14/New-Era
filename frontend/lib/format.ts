
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from '@/lib/constants';

export function formatPrice(price: number, currency: 'COP' | 'USD' = 'COP'): string {
  if (currency === 'USD') {
    const usdPrice = price / 4000; // Tasa de cambio aproximada: 1 USD = 4000 COP
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdPrice);
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}

export function getOrderTotal(subtotal: number): number {
  return subtotal + getShippingCost(subtotal);
}
