import { JuronoApiClient } from '../client';

export class Organizations {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, any>) {
    // params: q, subscriptionTier, subscriptionStatus, country, city, offset, limit
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/organizations${query}`, 'GET');
  }

  async create(data: any) {
    return this.client.request('/organizations', 'POST', data);
  }

  async getById(id: string) {
    return this.client.request(`/organizations/${id}`, 'GET');
  }

  async update(id: string, data: any) {
    return this.client.request(`/organizations/${id}`, 'PUT', data);
  }

  async listMembers(id: string, params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/organizations/${id}/members${query}`, 'GET');
  }

  async addMember(id: string, data: any) {
    return this.client.request(`/organizations/${id}/members`, 'POST', data);
  }

  async updateMember(id: string, memberId: string, data: any) {
    return this.client.request(`/organizations/${id}/members/${memberId}`, 'PUT', data);
  }

  async removeMember(id: string, memberId: string) {
    return this.client.request(`/organizations/${id}/members/${memberId}`, 'DELETE');
  }

  async invite(id: string, data: any) {
    return this.client.request(`/organizations/${id}/invitations`, 'POST', data);
  }

  async acceptInvitation() {
    return this.client.request('/organizations/invitations/accept', 'POST');
  }
}