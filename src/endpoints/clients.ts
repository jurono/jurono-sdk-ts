import { JuronoApiClient } from '../client';
import type { components } from '../types/api';

export class Clients {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, any>): Promise<any> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/clients${query}`, 'GET');
  }

  async create(data: components["schemas"]["CreateClientDto"]): Promise<any> {
    return this.client.request('/clients', 'POST', data);
  }

  async getById(id: string): Promise<any> {
    return this.client.request(`/clients/${id}`, 'GET');
  }

  async update(id: string, data: components["schemas"]["UpdateClientDto"]): Promise<any> {
    return this.client.request(`/clients/${id}`, 'PUT', data);
  }

  async getProfile(userId: string): Promise<any> {
    return this.client.request(`/clients/profiles/${userId}`, 'GET');
  }

  async upsertProfile(userId: string, data: components["schemas"]["UpdateClientProfileDto"]): Promise<any> {
    return this.client.request(`/clients/profiles/${userId}`, 'PUT', data);
  }
}