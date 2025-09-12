import { JuronoApiClient } from '../client';
import type { components } from '../types/api';
import type { ApiResponse } from '../types';

export class Organizations {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.client.request(`/organizations${query}`, 'GET');
  }

  async create(data: components["schemas"]["CreateOrganizationDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/organizations', 'POST', data);
  }

  async getById(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/organizations/${id}`, 'GET');
  }

  async update(id: string, data: components["schemas"]["UpdateOrganizationDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/organizations/${id}`, 'PUT', data);
  }

  async listMembers(id: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.client.request(`/organizations/${id}/members${query}`, 'GET');
  }

  async addMember(id: string, data: components["schemas"]["AddMemberDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/organizations/${id}/members`, 'POST', data);
  }

  async updateMember(id: string, memberId: string, data: components["schemas"]["UpdateMemberDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/organizations/${id}/members/${memberId}`, 'PUT', data);
  }

  async removeMember(id: string, memberId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request(`/organizations/${id}/members/${memberId}`, 'DELETE');
  }

  async invite(id: string, data: components["schemas"]["InviteMemberDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/organizations/${id}/invitations`, 'POST', data);
  }

  async acceptInvitation(): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request('/organizations/invitations/accept', 'POST');
  }
}