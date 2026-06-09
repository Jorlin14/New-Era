import api from './axios';
import type { Category } from '@/lib/types';

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
  return response.data.data;
}
