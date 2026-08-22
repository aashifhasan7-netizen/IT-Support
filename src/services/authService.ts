import apiClient from './apiClient';
import type { AuthCredentials, AuthSession } from '../types/auth';
import type { ApiResponse } from '../types/api';

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthSession> {
    const response = await apiClient.post<ApiResponse<AuthSession>>('/auth/login', credentials);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('helpdesk_session');
  },

  saveSession(session: AuthSession): void {
    localStorage.setItem('helpdesk_session', JSON.stringify(session));
  },

  loadSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem('helpdesk_session');
      if (!raw) return null;
      const session = JSON.parse(raw) as AuthSession;
      if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem('helpdesk_session');
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    localStorage.removeItem('helpdesk_session');
  },
};
