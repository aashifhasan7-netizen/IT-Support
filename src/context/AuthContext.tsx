import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthCredentials, AuthSession, Role, Permission } from '../types/auth';
import { authService } from '../services/authService';
import { hasPermission } from '../utils/permissions';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<User>;
  logout: () => Promise<void>;
  can: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = authService.loadSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    const session: AuthSession = await authService.login(credentials);
    authService.saveSession(session);
    setUser(session.user);
    setToken(session.token);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      authService.clearSession();
      setUser(null);
      setToken(null);
    }
  }, []);

  const can = useCallback(
    (permission: Permission) => hasPermission(user?.role, permission),
    [user]
  );

  const hasRoleFn = useCallback(
    (role: Role) => user?.role === role,
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        can,
        hasRole: hasRoleFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
