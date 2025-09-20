import { JuronoApiClient } from '../client';
import type { ApiResponse } from '../types';

// Token types
export interface TokenParams {
  page?: number;
  limit?: number;
  type?: 'api' | 'service' | 'webhook';
  status?: 'active' | 'revoked' | 'expired';
  sortBy?: 'createdAt' | 'lastUsed' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiTokensResponse {
  tokens: ApiToken[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiToken {
  id: string;
  name: string;
  type: 'api' | 'service' | 'webhook';
  status: 'active' | 'revoked' | 'expired';
  scopes: string[];
  description?: string;
  lastUsed?: string;
  usageCount: number;
  rateLimit?: {
    requests: number;
    period: string; // 'minute', 'hour', 'day'
  };
  ipWhitelist?: string[];
  expiresAt?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiTokenWithSecret extends ApiToken {
  token: string; // Only returned on creation
}

export interface CreateApiTokenData {
  name: string;
  description?: string;
  scopes: string[];
  expiresAt?: string;
  rateLimit?: {
    requests: number;
    period: 'minute' | 'hour' | 'day';
  };
  ipWhitelist?: string[];
}

export interface CreateServiceTokenData extends CreateApiTokenData {
  serviceId: string;
  permissions: string[];
}

export interface CreateWebhookTokenData extends CreateApiTokenData {
  webhookUrl: string;
  events: string[];
  secretKey?: string;
}

export interface TokenUsageStatsResponse {
  tokenId: string;
  period: {
    start: string;
    end: string;
  };
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rateLimitHits: number;
  averageResponseTime: number;
  dailyUsage: {
    date: string;
    requests: number;
    errors: number;
  }[];
  endpointUsage: {
    endpoint: string;
    method: string;
    requests: number;
    averageResponseTime: number;
  }[];
  errorBreakdown: {
    statusCode: number;
    count: number;
    percentage: number;
  }[];
}

export interface TokenScope {
  id: string;
  name: string;
  description: string;
  category: string;
  permissions: string[];
}

export class Tokens {
  constructor(private client: JuronoApiClient) {}

  async list(params: TokenParams = {}): Promise<ApiResponse<ApiTokensResponse>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.type) queryParams.set('type', params.type);
    if (params.status) queryParams.set('status', params.status);
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const query = queryParams.toString();
    return this.client.request(`/tokens${query ? `?${query}` : ''}`, 'GET');
  }

  async create(data: CreateApiTokenData): Promise<ApiResponse<ApiTokenWithSecret>> {
    return this.client.request('/tokens', 'POST', { ...data, type: 'api' });
  }

  async createService(data: CreateServiceTokenData): Promise<ApiResponse<ApiTokenWithSecret>> {
    return this.client.request('/tokens', 'POST', { ...data, type: 'service' });
  }

  async createWebhook(data: CreateWebhookTokenData): Promise<ApiResponse<ApiTokenWithSecret>> {
    return this.client.request('/tokens', 'POST', { ...data, type: 'webhook' });
  }

  async getById(id: string): Promise<ApiResponse<ApiToken>> {
    return this.client.request(`/tokens/${id}`, 'GET');
  }

  async getUsageStats(id: string, days: number = 30): Promise<ApiResponse<TokenUsageStatsResponse>> {
    return this.client.request(`/tokens/${id}/usage-stats?days=${days}`, 'GET');
  }

  async revoke(id: string): Promise<ApiResponse<void>> {
    return this.client.request(`/tokens/${id}/revoke`, 'POST');
  }

  async getScopes(): Promise<ApiResponse<TokenScope[]>> {
    return this.client.request('/tokens/scopes', 'GET');
  }
}