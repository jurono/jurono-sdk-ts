import { JuronoApiClient } from '../client';
import type { components } from '../types/api';
import type { ApiResponse } from '../types';

export class Clients {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.client.request(`/clients${query}`, 'GET');
  }

  async create(data: components["schemas"]["CreateClientDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/clients', 'POST', data);
  }

  async getById(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/clients/${id}`, 'GET');
  }

  async update(id: string, data: components["schemas"]["UpdateClientDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/clients/${id}`, 'PUT', data);
  }

  async getProfile(userId: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/clients/profiles/${userId}`, 'GET');
  }

  async upsertProfile(userId: string, data: components["schemas"]["UpdateClientProfileDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/clients/profiles/${userId}`, 'PUT', data);
  }
}