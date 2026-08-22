import apiClient from './apiClient';
import type { EmployeeDashboardStats, SupportDashboardStats } from '../types/dashboard';
import type { ApiResponse } from '../types/api';

export const dashboardService = {
  async getEmployeeDashboardStats(): Promise<EmployeeDashboardStats> {
    const response = await apiClient.get<ApiResponse<EmployeeDashboardStats>>('/dashboard/employee');
    return response.data.data;
  },

  async getSupportDashboardStats(): Promise<SupportDashboardStats> {
    const response = await apiClient.get<ApiResponse<SupportDashboardStats>>('/dashboard/support');
    return response.data.data;
  },
};
