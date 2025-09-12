import { JuronoApiClient } from '../client';
import type { components } from '../types/api';
import type { ApiResponse } from '../types';

export class Mandates {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, string | number | boolean>): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    const query = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return this.client.request(`/mandates${query}`, 'GET');
  }

  async getById(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/mandates/${id}`, 'GET');
  }

  async updatePricing(id: string, data: components["schemas"]["UpdatePricingDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/mandates/${id}/pricing`, 'POST', data);
  }

  async generateContract(id: string, data: components["schemas"]["ContractGenerateDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/mandates/${id}/contract/generate`, 'POST', data);
  }

  async customizeContract(id: string, data: components["schemas"]["ContractCustomizeDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/mandates/${id}/contract`, 'PUT', data);
  }

  async negotiate(id: string, data: components["schemas"]["NegotiateDto"]): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/mandates/${id}/negotiate`, 'POST', data);
  }

  async accept(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request(`/mandates/${id}/accept`, 'POST');
  }

  async decline(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request(`/mandates/${id}/decline`, 'POST');
  }

  async sign(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request(`/mandates/${id}/sign`, 'POST');
  }

  async finalizeContract(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request(`/mandates/${id}/contract/finalize`, 'POST');
  }

  async generatePdf(id: string): Promise<ApiResponse<{ url: string }>> {
    return this.client.request(`/mandates/${id}/contract/pdf`, 'POST');
  }
}