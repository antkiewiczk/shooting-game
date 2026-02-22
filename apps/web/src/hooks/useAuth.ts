import { useState, useCallback, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { ApiError } from '../services/api/client';

export interface UseAuthReturn {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService.initialize();
  }, []);

  const login = useCallback((newToken: string) => {
    try {
      authService.setToken(newToken);
      setToken(newToken);
      setError(null);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to login';
      setError(message);
    }
  }, []);

  const logout = useCallback(() => {
    authService.clearToken();
    setToken(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    token,
    isAuthenticated: !!token,
    login,
    logout,
    error,
    clearError,
  };
}
