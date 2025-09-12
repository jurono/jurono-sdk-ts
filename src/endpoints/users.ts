import { JuronoApiClient } from '../client';

export class Users {
  constructor(private client: JuronoApiClient) {}

  async list() {
    return this.client.request('/users', 'GET');
  }

  async getById(id: string) {
    return this.client.request(`/users/${id}`, 'GET');
  }

  async update(id: string, data: any) {
    return this.client.request(`/users/${id}`, 'PUT', data);
  }

  async delete(id: string) {
    return this.client.request(`/users/${id}`, 'DELETE');
  }

  async getProfile(id: string) {
    return this.client.request(`/users/${id}/profile`, 'GET');
  }

  async updateProfile(id: string, data: any) {
    return this.client.request(`/users/${id}/profile`, 'PUT', data);
  }

  async listComments(id: string) {
    return this.client.request(`/users/${id}/comments`, 'GET');
  }

  async addComment(id: string, data: { message: string }) {
    return this.client.request(`/users/${id}/comments`, 'POST', data);
  }
}