import { JuronoApiClient } from '../client';
import type { components } from '../types/api';

export class Users {
  constructor(private client: JuronoApiClient) {}

  async list(): Promise<any> {
    return this.client.request('/users', 'GET');
  }

  async getById(id: string): Promise<any> {
    return this.client.request(`/users/${id}`, 'GET');
  }

  async update(id: string, data: any): Promise<any> {
    return this.client.request(`/users/${id}`, 'PUT', data);
  }

  async delete(id: string): Promise<any> {
    return this.client.request(`/users/${id}`, 'DELETE');
  }

  async getProfile(id: string): Promise<any> {
    return this.client.request(`/users/${id}/profile`, 'GET');
  }

  async updateProfile(id: string, data: components["schemas"]["UpdateProfileDto"]): Promise<any> {
    return this.client.request(`/users/${id}/profile`, 'PUT', data);
  }

  async listComments(id: string): Promise<any> {
    return this.client.request(`/users/${id}/comments`, 'GET');
  }

  async addComment(id: string, data: components["schemas"]["AddCommentDto"]): Promise<any> {
    return this.client.request(`/users/${id}/comments`, 'POST', data);
  }
}