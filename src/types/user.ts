import type { User } from './auth';

export type { User };

export interface SupportEngineer {
  id: string;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  activeTickets: number;
  resolvedTickets: number;
  status: 'Active' | 'Inactive';
}
