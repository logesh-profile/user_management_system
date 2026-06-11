import axiosInstance from './axiosInstance';
import type { User } from '../types';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const register = async (data: FormData): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/register', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const getMe = async (): Promise<{ success: boolean; data: { user: User } }> => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
