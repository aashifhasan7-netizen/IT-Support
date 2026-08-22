import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/auth';
import { ticketHandlers } from './handlers/tickets';
import { userHandlers } from './handlers/users';
import { dashboardHandlers } from './handlers/dashboard';

export const worker = setupWorker(
  ...authHandlers,
  ...ticketHandlers,
  ...userHandlers,
  ...dashboardHandlers,
);
