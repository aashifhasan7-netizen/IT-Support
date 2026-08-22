import type { Role, Permission } from '../types/auth';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  EMPLOYEE: [
    'ticket:create',
    'ticket:view-own',
    'ticket:view-own-progress',
  ],
  SUPPORT_ENGINEER: [
    'ticket:view-all',
    'ticket:search',
    'ticket:filter',
    'ticket:reassign',
    'ticket:update-status',
    'ticket:add-resolution',
  ],
};

export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasRole(userRole: Role | undefined, requiredRole: Role): boolean {
  return userRole === requiredRole;
}

export { ROLE_PERMISSIONS };
