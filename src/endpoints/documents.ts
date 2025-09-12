import { JuronoApiClient } from '../client';
import type { ApiResponse } from '../types';

export interface DocumentUploadData {
  file: File | Buffer;
  fileName: string;
  mimeType?: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentRetentionData {
  retentionPeriod: number;
  unit: 'days' | 'months' | 'years';
}

export class Documents {
  constructor(private client: JuronoApiClient) {}

  async list(): Promise<ApiResponse<Array<Record<string, unknown>>>> {
    return this.client.request('/documents', 'GET');
  }

  async upload(data: DocumentUploadData): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/documents', 'POST', data);
  }

  async getById(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/documents/${id}`, 'GET');
  }

  async download(id: string): Promise<ApiResponse<{ url: string }>> {
    return this.client.request(`/documents/${id}/download`, 'GET');
  }

  async newVersion(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request(`/documents/${id}/version`, 'POST');
  }

  async signedUrl(id: string): Promise<ApiResponse<{ url: string; expiresAt: string }>> {
    return this.client.request(`/documents/${id}/signed-url`, 'GET');
  }

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.client.request(`/documents/${id}/delete`, 'POST');
  }

  async setRetention(data: DocumentRetentionData): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.request('/documents/retention', 'POST', data);
  }

  async getRetention(): Promise<ApiResponse<DocumentRetentionData>> {
    return this.client.request('/documents/retention', 'GET');
  }

  async purge(): Promise<ApiResponse<{ purgedCount: number }>> {
    return this.client.request('/documents/purge', 'POST');
  }
}