'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatPrice as formatPriceLib } from '@/lib/format';

type Currency = 'COP' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('COP');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem('currency');
    if (stored === 'USD' || stored === 'COP') {
      setCurrency(stored);
    }
  }, []);

  const handleSetCurrency = React.useCallback((newCurrency: Currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  }, []);

  const formatPrice = React.useCallback((price: number) => {
    if (!isMounted) {
      return formatPriceLib(price, 'COP');
    }
    return formatPriceLib(price, currency);
  }, [isMounted, currency]);

  const value = React.useMemo(() => ({
    currency,
    setCurrency: handleSetCurrency,
    formatPrice
  }), [currency, handleSetCurrency, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
