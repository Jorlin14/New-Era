import api from './axios';
import type { Product } from '@/lib/types';

export async function getProducts(
  search?: string,
  categoryId?: string
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (categoryId) params.set('categoryId', categoryId);
  
  // Realizamos la llamada real
  const response = await api.get<{ success: boolean; data: Product[] }>(`/products?${params.toString()}`);
  return response.data.data;
}

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
  return response.data.data;
}
