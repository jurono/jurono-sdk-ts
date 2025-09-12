import { JuronoApiClient } from '../client';

export class Clients {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/clients${query}`, 'GET');
  }

  async create(data: any) {
    return this.client.request('/clients', 'POST', data);
  }

  async getById(id: string) {
    return this.client.request(`/clients/${id}`, 'GET');
  }

  async update(id: string, data: any) {
    return this.client.request(`/clients/${id}`, 'PUT', data);
  }

  async getProfile(userId: string) {
    return this.client.request(`/clients/profiles/${userId}`, 'GET');
  }

  async upsertProfile(userId: string, data: any) {
    return this.client.request(`/clients/profiles/${userId}`, 'PUT', data);
  }
}