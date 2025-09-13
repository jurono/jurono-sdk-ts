import { useState, useCallback } from 'react';
import { useJurono } from './provider';
import { JuronoApiError } from '../types/errors';

export interface LoginState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UseLoginOptions {
  onSuccess?: (user: AuthUser) => void;
  onError?: (error: string) => void;
  requireAdminRole?: boolean;
}

export interface UseLoginResult {
  login: (email: string, password: string) => Promise<void>;
  state: LoginState;
  reset: () => void;
}

/**
 * Hook for handling user login with the Jurono API
 */
export function useLogin(options: UseLoginOptions = {}): UseLoginResult {
  const { auth } = useJurono();
  const { onSuccess, onError, requireAdminRole = false } = options;
  
  const [state, setState] = useState<LoginState>({
    loading: false,
    error: null,
    success: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState({ loading: true, error: null, success: false });

    try {
      const response = await auth.login({ email, password });
      const responseData = response.data as any;
      
      const user = responseData.user || responseData;
      const token = responseData.access_token || responseData.token || responseData.accessToken;
      
      if (!user) {
        throw new Error('No user data returned from authentication');
      }

      if (requireAdminRole) {
        const userRole = user.role;
        if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
          throw new Error('Admin access required');
        }
      }

      if (!token) {
        throw new Error('Authentication failed - no token received');
      }

      const authUser: AuthUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      setState({ loading: false, error: null, success: true });
      onSuccess?.(authUser);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof JuronoApiError) {
        errorMessage = error.response?.message || error.response?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({ loading: false, error: errorMessage, success: false });
      onError?.(errorMessage);
    }
  }, [auth, onSuccess, onError, requireAdminRole]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: false });
  }, []);

  return { login, state, reset };
}

export interface UseAuthManagerOptions {
  requireAdminRole?: boolean;
}

export interface UseAuthManagerResult {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Complete authentication hook with user state management
 */
export function useAuthManager(options: UseAuthManagerOptions = {}): UseAuthManagerResult {
  const { auth } = useJurono();
  const { requireAdminRole = false } = options;
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await auth.login({ email, password });
      const responseData = response.data as any;
      
      const userData = responseData.user || responseData;
      const token = responseData.access_token || responseData.token || responseData.accessToken;
      
      if (!userData) {
        throw new Error('No user data returned from authentication');
      }

      if (requireAdminRole) {
        const userRole = userData.role;
        if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
          throw new Error('Admin access required');
        }
      }

      if (!token) {
        throw new Error('Authentication failed - no token received');
      }

      const authUser: AuthUser = {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
      };

      setUser(authUser);
      setLoading(false);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof JuronoApiError) {
        errorMessage = error.response?.message || error.response?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setLoading(false);
      setUser(null);
    }
  }, [auth, requireAdminRole]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // If we have a user, try to call logout endpoint
      if (user) {
        await auth.logout({ refreshToken: 'current' }); // Assuming token is managed internally
      }
      
      setUser(null);
      setLoading(false);
    } catch (error) {
      // Even if logout endpoint fails, clear local state
      setUser(null);
      setLoading(false);
      console.warn('Logout endpoint failed:', error);
    }
  }, [auth, user]);

  const refresh = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await auth.me();
      const userData = response.data as any;
      
      const refreshedUser = userData.user || userData.data || userData;
      
      if (!refreshedUser) {
        throw new Error('Failed to refresh user data');
      }

      if (requireAdminRole) {
        const userRole = refreshedUser.role;
        if (!userRole || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
          throw new Error('Admin access required');
        }
      }

      const authUser: AuthUser = {
        id: refreshedUser.id,
        firstName: refreshedUser.firstName,
        lastName: refreshedUser.lastName,
        email: refreshedUser.email,
        role: refreshedUser.role,
      };

      setUser(authUser);
      setLoading(false);
    } catch (error) {
      let errorMessage = 'Failed to refresh user data';
      
      if (error instanceof JuronoApiError) {
        if (error.status === 401) {
          // Token expired, clear user
          setUser(null);
          errorMessage = 'Session expired';
        } else {
          errorMessage = error.response?.message || error.response?.error || error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setLoading(false);
    }
  }, [auth, user, requireAdminRole]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    refresh,
  };
}