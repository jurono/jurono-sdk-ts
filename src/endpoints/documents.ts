import { JuronoApiClient } from '../client';
import type { components } from '../types/api';

export class Documents {
  constructor(private client: JuronoApiClient) {}

  async list(): Promise<any> {
    return this.client.request('/documents', 'GET');
  }

  async upload(data: any): Promise<any> {
    return this.client.request('/documents', 'POST', data);
  }

  async getById(id: string): Promise<any> {
    return this.client.request(`/documents/${id}`, 'GET');
  }

  async download(id: string): Promise<any> {
    return this.client.request(`/documents/${id}/download`, 'GET');
  }

  async newVersion(id: string): Promise<any> {
    return this.client.request(`/documents/${id}/version`, 'POST');
  }

  async signedUrl(id: string): Promise<any> {
    return this.client.request(`/documents/${id}/signed-url`, 'GET');
  }

  async delete(id: string): Promise<any> {
    return this.client.request(`/documents/${id}/delete`, 'POST');
  }

  async setRetention(data: any): Promise<any> {
    return this.client.request('/documents/retention', 'POST', data);
  }

  async getRetention(): Promise<any> {
    return this.client.request('/documents/retention', 'GET');
  }

  async purge(): Promise<any> {
    return this.client.request('/documents/purge', 'POST');
  }
}