import { JuronoApiClient } from '../client';
import type { components } from '../types/api';

export class Mandates {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, any>): Promise<any> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/mandates${query}`, 'GET');
  }

  async getById(id: string): Promise<any> {
    return this.client.request(`/mandates/${id}`, 'GET');
  }

  async updatePricing(id: string, data: components["schemas"]["UpdatePricingDto"]): Promise<any> {
    return this.client.request(`/mandates/${id}/pricing`, 'POST', data);
  }

  async generateContract(id: string, data: components["schemas"]["ContractGenerateDto"]): Promise<any> {
    return this.client.request(`/mandates/${id}/contract/generate`, 'POST', data);
  }

  async customizeContract(id: string, data: components["schemas"]["ContractCustomizeDto"]): Promise<any> {
    return this.client.request(`/mandates/${id}/contract`, 'PUT', data);
  }

  async negotiate(id: string, data: components["schemas"]["NegotiateDto"]): Promise<any> {
    return this.client.request(`/mandates/${id}/negotiate`, 'POST', data);
  }

  async accept(id: string): Promise<any> {
    return this.client.request(`/mandates/${id}/accept`, 'POST');
  }

  async decline(id: string): Promise<any> {
    return this.client.request(`/mandates/${id}/decline`, 'POST');
  }

  async sign(id: string): Promise<any> {
    return this.client.request(`/mandates/${id}/sign`, 'POST');
  }

  async finalizeContract(id: string): Promise<any> {
    return this.client.request(`/mandates/${id}/contract/finalize`, 'POST');
  }

  async generatePdf(id: string): Promise<any> {
    return this.client.request(`/mandates/${id}/contract/pdf`, 'POST');
  }
}