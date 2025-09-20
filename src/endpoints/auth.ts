import { JuronoApiClient } from '../client';
import type { components } from '../types/api';
import type { ApiResponse, LoginResponse } from '../types';

// Type definitions for operations (using available operations from OpenAPI spec)

export class Auth {
  constructor(private client: JuronoApiClient) {}

  async login(data: components["schemas"]["LoginDto"]): Promise<ApiResponse<LoginResponse>> {
    return this.client.request('/auth/login', 'POST', data);
  }

  async register(data: components["schemas"]["RegisterDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/register', 'POST', data);
  }

  async me(): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/me', 'GET');
  }

  async requestVerifyEmail(): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/verify-email/request', 'POST');
  }

  async verifyEmail(token: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/auth/verify-email?token=${encodeURIComponent(token)}`, 'GET');
  }

  async passwordResetRequest(data: components["schemas"]["PasswordResetRequestDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/password/reset-request', 'POST', data);
  }

  async passwordResetConfirm(data: components["schemas"]["PasswordResetConfirmDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/password/reset-confirm', 'POST', data);
  }

  async refresh(data: components["schemas"]["RefreshDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/refresh', 'POST', data);
  }

  async logout(data: components["schemas"]["LogoutDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/logout', 'POST', data);
  }

  async logoutAll(): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/auth/logout-all', 'POST');
  }
}