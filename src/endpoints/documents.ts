import { JuronoApiClient } from '../client';

export class Documents {
  constructor(private client: JuronoApiClient) {}

  async list() {
    return this.client.request('/documents', 'GET');
  }

  async upload(data: any) {
    return this.client.request('/documents', 'POST', data);
  }

  async getById(id: string) {
    return this.client.request(`/documents/${id}`, 'GET');
  }

  async download(id: string) {
    return this.client.request(`/documents/${id}/download`, 'GET');
  }

  async newVersion(id: string) {
    return this.client.request(`/documents/${id}/version`, 'POST');
  }

  async signedUrl(id: string) {
    return this.client.request(`/documents/${id}/signed-url`, 'GET');
  }

  async delete(id: string) {
    return this.client.request(`/documents/${id}/delete`, 'POST');
  }

  async setRetention(data: any) {
    return this.client.request('/documents/retention', 'POST', data);
  }

  async getRetention() {
    return this.client.request('/documents/retention', 'GET');
  }

  async purge() {
    return this.client.request('/documents/purge', 'POST');
  }
}