import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/auth';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRole: Role;
  redirectTo?: string;
}

export function RoleRoute({ children, allowedRole, redirectTo }: RoleRouteProps) {
  const { user } = useAuth();

  if (!user || user.role !== allowedRole) {
    const fallback = user?.role === 'EMPLOYEE' ? '/employee/dashboard' : '/support/dashboard';
    return <Navigate to={redirectTo ?? fallback} replace />;
  }

  return <>{children}</>;
}
