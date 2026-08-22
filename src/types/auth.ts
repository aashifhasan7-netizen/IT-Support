export type Role = 'EMPLOYEE' | 'SUPPORT_ENGINEER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  employeeId: string;
  avatar?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type Permission =
  | 'ticket:create'
  | 'ticket:view-own'
  | 'ticket:view-own-progress'
  | 'ticket:view-all'
  | 'ticket:search'
  | 'ticket:filter'
  | 'ticket:reassign'
  | 'ticket:update-status'
  | 'ticket:add-resolution';
