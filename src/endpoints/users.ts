import { JuronoApiClient } from '../client';
import type { components } from '../types/api';
import type { ApiResponse } from '../types';

export class Users {
  constructor(private client: JuronoApiClient) {}

  async list(): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    return this.client.request('/users', 'GET');
  }

  async getById(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/users/${id}`, 'GET');
  }

  async update(id: string, data: Partial<Record<string, unknown>>): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/users/${id}`, 'PUT', data);
  }

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request(`/users/${id}`, 'DELETE');
  }

  async getProfile(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/users/${id}/profile`, 'GET');
  }

  async updateProfile(id: string, data: components["schemas"]["UpdateProfileDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/users/${id}/profile`, 'PUT', data);
  }

  async listComments(id: string): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    return this.client.request(`/users/${id}/comments`, 'GET');
  }

  async addComment(id: string, data: components["schemas"]["AddCommentDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/users/${id}/comments`, 'POST', data);
  }
}