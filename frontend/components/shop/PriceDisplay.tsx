'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';

interface PriceDisplayProps {
  price: number;
  className?: string;
}

export default function PriceDisplay({ price, className }: PriceDisplayProps) {
  const { formatPrice } = useCurrency();
  
  return (
    <span className={className}>
      {formatPrice(price)}
    </span>
  );
}
