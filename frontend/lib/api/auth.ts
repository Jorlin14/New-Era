import api from './axios';

export interface LoginData {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'CUSTOMER' | 'DELIVERER' | 'CASHIER';
  };
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<{success: boolean, message: string, data: AuthResponse}>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<{success: boolean, message: string, data: AuthResponse}>('/auth/register', data);
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me'); // Ajusta según la ruta real de tu backend
    return response.data?.data || response.data;
  },
};
