'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, logout as logoutService } from '@/services/auth.service';
import { ROLES } from '@/lib/constants';

const AuthContext = createContext(null);

const STORAGE_KEYS = { TOKEN: 'auth_token', USER: 'auth_user' };

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Malformed storage – clear it
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: loggedInUser, token: authToken } = await loginService(email, password);
    localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
    setToken(authToken);
    setUser(loggedInUser);

    // Role-based redirect
    if (loggedInUser.role === ROLES.PRINCIPAL) {
      router.replace('/principal/dashboard');
    } else if (loggedInUser.role === ROLES.TEACHER) {
      router.replace('/teacher/dashboard');
    } else {
      router.replace('/');
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
      router.replace('/login');
    }
  }, [router]);

  const isAuthenticated = Boolean(token && user);
  const isTeacher = user?.role === ROLES.TEACHER;
  const isPrincipal = user?.role === ROLES.PRINCIPAL;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isTeacher,
        isPrincipal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
