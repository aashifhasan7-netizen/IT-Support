import apiClient from './apiClient';
import type { User } from '../types/auth';
import type { ApiResponse } from '../types/api';

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  async getSupportEngineers(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users/engineers');
    return response.data.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },
};
