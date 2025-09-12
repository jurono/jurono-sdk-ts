import { JuronoApiClient } from '../client';

export class Mandates {
  constructor(private client: JuronoApiClient) {}

  async list(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.client.request(`/mandates${query}`, 'GET');
  }

  async getById(id: string) {
    return this.client.request(`/mandates/${id}`, 'GET');
  }

  async updatePricing(id: string, data: any) {
    return this.client.request(`/mandates/${id}/pricing`, 'POST', data);
  }

  async generateContract(id: string, data: any) {
    return this.client.request(`/mandates/${id}/contract/generate`, 'POST', data);
  }

  async customizeContract(id: string, data: any) {
    return this.client.request(`/mandates/${id}/contract`, 'PUT', data);
  }

  async negotiate(id: string, data: any) {
    return this.client.request(`/mandates/${id}/negotiate`, 'POST', data);
  }

  async accept(id: string) {
    return this.client.request(`/mandates/${id}/accept`, 'POST');
  }

  async decline(id: string) {
    return this.client.request(`/mandates/${id}/decline`, 'POST');
  }

  async sign(id: string) {
    return this.client.request(`/mandates/${id}/sign`, 'POST');
  }

  async finalizeContract(id: string) {
    return this.client.request(`/mandates/${id}/contract/finalize`, 'POST');
  }

  async generatePdf(id: string) {
    return this.client.request(`/mandates/${id}/contract/pdf`, 'POST');
  }
}