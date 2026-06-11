import axiosInstance from './axiosInstance';
import type { User, UserStats } from '../types';

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface SingleUserResponse {
  success: boolean;
  data: { user: User };
}

interface StatsResponse {
  success: boolean;
  data: { stats: UserStats };
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const getAllUsers = async (params: FetchUsersParams = {}): Promise<UsersResponse> => {
  const response = await axiosInstance.get('/users', { params });
  return response.data;
};

export const getUserById = async (id: string): Promise<SingleUserResponse> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<SingleUserResponse> => {
  const response = await axiosInstance.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};

export const getStats = async (): Promise<StatsResponse> => {
  const response = await axiosInstance.get('/users/stats');
  return response.data;
};

export const updateProfile = async (data: FormData): Promise<SingleUserResponse> => {
  const response = await axiosInstance.put('/users/profile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await axiosInstance.put('/users/password', { currentPassword, newPassword });
};

export const deleteAccount = async (): Promise<void> => {
  await axiosInstance.delete('/users/account');
};
