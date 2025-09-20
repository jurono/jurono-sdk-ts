'use server';

import { cookies } from 'next/headers';
import { createServerSDK } from '../utils/server';
import { JuronoApiError, JuronoNetworkError, JuronoTimeoutError, JuronoAbortError } from '../types/errors';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  };
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

/**
 * Next.js server action to login with email and password
 * Validates admin role and sets secure cookie
 */
export async function login(
  email: string, 
  password: string,
  options?: {
    apiKey?: string;
    requireAdminRole?: boolean;
    cookieName?: string;
    cookieMaxAge?: number;
  }
): Promise<AuthResult> {
  try {
    const {
      apiKey = 'temp',
      requireAdminRole = true,
      cookieName = 'admin-token',
      cookieMaxAge = 60 * 60 * 24 * 7 // 1 week
    } = options || {};

    // Create SDK instance for login
    const sdk = createServerSDK({
      apiKey,
      timeout: 15000,
      retries: 1,
    });

    console.log(`[Jurono SDK] Attempting login for: ${email}`);
    const response = await sdk.auth.login({ email, password });
    
    // Extract user data and token from SDK response
    const responseData = response.data as any;
    const user = responseData.user || responseData;
    const accessToken = responseData.token || responseData.access_token || responseData.accessToken;
    
    if (!user) {
      return { success: false, error: 'No user data returned from authentication' };
    }

    if (requireAdminRole) {
      const userRoles = user.roles || [user.role];
      const hasAdminRole = userRoles.some((role: string) => role === 'ADMIN' || role === 'SUPER_ADMIN');
      if (!hasAdminRole) {
        return { success: false, error: 'Admin access required' };
      }
    }

    if (!accessToken) {
      return { success: false, error: 'Authentication failed - no token received' };
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set(cookieName, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/',
    });
    
    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles || [user.role].filter(Boolean),
      }
    };
  } catch (error) {
    console.error('[Jurono SDK] Login error:', error);
    
    if (error instanceof JuronoApiError) {
      const errorMessage = error.response?.message || error.response?.error || error.message;
      return { success: false, error: errorMessage };
    } else if (error instanceof JuronoNetworkError) {
      return { success: false, error: 'Network connection failed. Please check your internet connection.' };
    } else if (error instanceof JuronoTimeoutError) {
      return { success: false, error: 'Request timed out. Please try again.' };
    } else if (error instanceof JuronoAbortError) {
      return { success: false, error: 'Request was cancelled. Please try again.' };
    } else {
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }
}

/**
 * Next.js server action to get current authenticated user
 * Validates token and returns user data
 */
export async function getUser(
  options?: {
    cookieName?: string;
    requireAdminRole?: boolean;
  }
): Promise<AdminUser | null> {
  try {
    const {
      cookieName = 'admin-token',
      requireAdminRole = true
    } = options || {};

    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName);
    
    if (!token) {
      return null;
    }

    const sdk = createServerSDK({
      apiKey: token.value,
      timeout: 15000,
      retries: 1,
    });

    const response = await sdk.auth.me();
    const userData = response.data as any;
    
    // Handle nested API response structure
    const user = userData.user || userData.data || userData;
    
    if (!user) {
      return null;
    }

    if (requireAdminRole) {
      const userRoles = user.roles || [user.role];
      const hasAdminRole = userRoles.some((role: string) => role === 'ADMIN' || role === 'SUPER_ADMIN');
      if (!hasAdminRole) {
        return null;
      }
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles || [user.role].filter(Boolean),
    };
  } catch (error) {
    console.error('[Jurono SDK] Get user error:', error);
    
    if (error instanceof JuronoApiError && error.status === 401) {
      // Token is invalid, should clear cookie
      return null;
    }
    
    return null;
  }
}

/**
 * Next.js server action to logout current user
 * Clears authentication cookie
 */
export async function logout(
  options?: {
    cookieName?: string;
    callLogoutEndpoint?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const {
      cookieName = 'admin-token',
      callLogoutEndpoint = true
    } = options || {};

    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName);
    
    // Call logout endpoint if requested and token exists
    if (callLogoutEndpoint && token) {
      try {
        const sdk = createServerSDK({
          apiKey: token.value,
          timeout: 10000,
          retries: 1,
        });
        
        await sdk.auth.logout({ refreshToken: token.value });
      } catch (error) {
        console.warn('[Jurono SDK] Logout endpoint failed:', error);
        // Continue with cookie clearing even if endpoint fails
      }
    }

    // Clear the cookie
    cookieStore.delete(cookieName);
    
    return { success: true };
  } catch (error) {
    console.error('[Jurono SDK] Logout error:', error);
    return { success: false, error: 'Failed to logout' };
  }
}

/**
 * Next.js server action to refresh authentication token
 */
export async function refresh(
  options?: {
    cookieName?: string;
    cookieMaxAge?: number;
  }
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    const {
      cookieName = 'admin-token',
      cookieMaxAge = 60 * 60 * 24 * 7 // 1 week
    } = options || {};

    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName);
    
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const sdk = createServerSDK({
      apiKey: token.value,
      timeout: 15000,
      retries: 1,
    });

    const response = await sdk.auth.refresh({ refreshToken: token.value });
    const responseData = response.data as any;
    
    const newToken = responseData.token || responseData.access_token || responseData.accessToken;
    const user = responseData.user || responseData;
    
    if (!newToken) {
      return { success: false, error: 'Failed to refresh token' };
    }

    // Update cookie with new token
    cookieStore.set(cookieName, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: cookieMaxAge,
      path: '/',
    });
    
    return {
      success: true,
      user: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles || [user.role].filter(Boolean),
      } : undefined
    };
  } catch (error) {
    console.error('[Jurono SDK] Refresh error:', error);
    
    if (error instanceof JuronoApiError) {
      const errorMessage = error.response?.message || error.response?.error || error.message;
      return { success: false, error: errorMessage };
    }
    
    return { success: false, error: 'Failed to refresh authentication' };
  }
}