'use client';

import { useCallback, useState } from 'react';
import Header from '@/components/shop/Header';
import Hero from '@/components/shop/Hero';
import Categories from '@/components/shop/Categories';
import ProductsGrid from '@/components/shop/ProductsGrid';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <>
      <Header onSearch={handleSearch} />
      <Hero />
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <ProductsGrid searchQuery={searchQuery} selectedCategory={selectedCategory} />
    </>
  );
}
