import { JuronoApiClient } from '../client';
import type { components } from '../types/api';

export class Auth {
  constructor(private client: JuronoApiClient) {}

  async login(data: components["schemas"]["LoginDto"]): Promise<any> {
    return this.client.request('/auth/login', 'POST', data);
  }

  async register(data: components["schemas"]["RegisterDto"]): Promise<any> {
    return this.client.request('/auth/register', 'POST', data);
  }

  async me(): Promise<any> {
    return this.client.request('/auth/me', 'GET');
  }

  async requestVerifyEmail(): Promise<any> {
    return this.client.request('/auth/verify-email/request', 'POST');
  }

  async verifyEmail(token: string): Promise<any> {
    return this.client.request(`/auth/verify-email?token=${encodeURIComponent(token)}`, 'GET');
  }

  async passwordResetRequest(data: components["schemas"]["PasswordResetRequestDto"]): Promise<any> {
    return this.client.request('/auth/password/reset-request', 'POST', data);
  }

  async passwordResetConfirm(data: components["schemas"]["PasswordResetConfirmDto"]): Promise<any> {
    return this.client.request('/auth/password/reset-confirm', 'POST', data);
  }

  async refresh(data: components["schemas"]["RefreshDto"]): Promise<any> {
    return this.client.request('/auth/refresh', 'POST', data);
  }

  async logout(data: components["schemas"]["LogoutDto"]): Promise<any> {
    return this.client.request('/auth/logout', 'POST', data);
  }

  async logoutAll(): Promise<any> {
    return this.client.request('/auth/logout-all', 'POST');
  }
}