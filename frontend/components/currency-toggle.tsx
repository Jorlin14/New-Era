'use client';

import * as React from 'react';
import { DollarSign, Coins } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

import { Button } from '@/components/ui/button';

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  const toggleCurrency = () => {
    setCurrency(currency === 'COP' ? 'USD' : 'COP');
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="border-slate-200 dark:border-slate-700 bg-transparent shrink-0 relative overflow-hidden group w-9 h-9 sm:w-10 sm:h-10"
      onClick={toggleCurrency}
      title={`Moneda actual: ${currency}. Cambiar a ${currency === 'COP' ? 'USD' : 'COP'}`}
    >
      <span className={`absolute flex items-center justify-center font-bold text-xs transition-all duration-300 ${currency === 'COP' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        COP
      </span>
      <span className={`absolute flex items-center justify-center font-bold text-xs transition-all duration-300 ${currency === 'USD' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        USD
      </span>
      <span className="sr-only">Cambiar moneda</span>
    </Button>
  );
}
