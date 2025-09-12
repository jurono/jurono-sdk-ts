// Jurono API Client
import { JuronoApiOptions } from './types/index';

export class JuronoApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: JuronoApiOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://api.jurono.eu/api';
  }

  public async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}
