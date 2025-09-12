import { JuronoApiClient } from '../client';
import type { components } from '../types/api';

export class Organizations {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, any>): Promise<any> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/organizations${query}`, 'GET');
  }

  async create(data: components["schemas"]["CreateOrganizationDto"]): Promise<any> {
    return this.client.request('/organizations', 'POST', data);
  }

  async getById(id: string): Promise<any> {
    return this.client.request(`/organizations/${id}`, 'GET');
  }

  async update(id: string, data: components["schemas"]["UpdateOrganizationDto"]): Promise<any> {
    return this.client.request(`/organizations/${id}`, 'PUT', data);
  }

  async listMembers(id: string, params?: Record<string, any>): Promise<any> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/organizations/${id}/members${query}`, 'GET');
  }

  async addMember(id: string, data: components["schemas"]["AddMemberDto"]): Promise<any> {
    return this.client.request(`/organizations/${id}/members`, 'POST', data);
  }

  async updateMember(id: string, memberId: string, data: components["schemas"]["UpdateMemberDto"]): Promise<any> {
    return this.client.request(`/organizations/${id}/members/${memberId}`, 'PUT', data);
  }

  async removeMember(id: string, memberId: string): Promise<any> {
    return this.client.request(`/organizations/${id}/members/${memberId}`, 'DELETE');
  }

  async invite(id: string, data: components["schemas"]["InviteMemberDto"]): Promise<any> {
    return this.client.request(`/organizations/${id}/invitations`, 'POST', data);
  }

  async acceptInvitation(): Promise<any> {
    return this.client.request('/organizations/invitations/accept', 'POST');
  }
}