import apiClient from './apiClient';
import type { Ticket, TicketFilters, CreateTicketRequest, AssignTicketRequest, UpdateTicketStatusRequest } from '../types/ticket';
import type { ApiResponse } from '../types/api';

interface TicketsResponse extends ApiResponse<Ticket[]> {
  total: number;
}

export const ticketService = {
  async getTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.issueType) params.set('issueType', filters.issueType);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.assignedEngineerId) params.set('assignedEngineerId', filters.assignedEngineerId);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);

    const response = await apiClient.get<TicketsResponse>(`/tickets?${params.toString()}`);
    return response.data.data;
  },

  async getMyTickets(filters?: TicketFilters): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.category) params.set('category', filters.category);

    const response = await apiClient.get<TicketsResponse>(`/tickets/my?${params.toString()}`);
    return response.data.data;
  },

  async getTicketById(id: string): Promise<Ticket> {
    const response = await apiClient.get<ApiResponse<Ticket>>(`/tickets/${id}`);
    return response.data.data;
  },

  async createTicket(data: CreateTicketRequest & { createdByName: string; createdByEmail: string }): Promise<Ticket> {
    const response = await apiClient.post<ApiResponse<Ticket>>('/tickets', data);
    return response.data.data;
  },

  async assignTicket(ticketId: string, data: AssignTicketRequest & { previousEngineerName?: string }): Promise<Ticket> {
    const response = await apiClient.patch<ApiResponse<Ticket>>(`/tickets/${ticketId}/assign`, data);
    return response.data.data;
  },

  async updateTicketStatus(ticketId: string, data: UpdateTicketStatusRequest & { performedBy: string; performedById: string }): Promise<Ticket> {
    const response = await apiClient.patch<ApiResponse<Ticket>>(`/tickets/${ticketId}/status`, data);
    return response.data.data;
  },
};
