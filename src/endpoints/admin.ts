import { JuronoApiClient } from '../client';
import type { ApiResponse } from '../types';

// Admin types
export interface AdminMetrics {
  totalUsers: number;
  totalOrganizations: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface AdminAnalytics {
  timeframe: string;
  userGrowth: number[];
  revenue: number[];
  organizationGrowth: number[];
}

export interface UserMetrics {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export interface ImpersonationResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface EmailData {
  subject: string;
  body: string;
  template?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EmailHistoryResponse {
  emails: EmailDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EmailDetails {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
}

export interface SupportTicketParams extends PaginationParams {
  status?: 'open' | 'closed' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface SupportTicketsResponse {
  tickets: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketDetails extends SupportTicket {
  replies: SupportTicketReply[];
  attachments: string[];
}

export interface SupportTicketReply {
  id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface CreateSupportTicketData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface UpdateSupportTicketData {
  title?: string;
  description?: string;
  status?: 'open' | 'closed' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface ReplyData {
  message: string;
}

export interface SupportMetrics {
  total: number;
  open: number;
  closed: number;
  pending: number;
  averageResponseTime: number;
}

export interface SubscriptionParams extends PaginationParams {
  status?: 'active' | 'cancelled' | 'expired';
  plan?: string;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  amount: number;
  currency: string;
}

export interface SubscriptionDetails extends Subscription {
  paymentHistory: PaymentRecord[];
  usage: SubscriptionUsage;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'failed' | 'pending';
  date: string;
}

export interface SubscriptionUsage {
  current: number;
  limit: number;
  period: string;
}

export interface CancelOptions {
  reason?: string;
  immediate?: boolean;
}

export interface CancelResponse {
  success: boolean;
  refundAmount?: number;
  effectiveDate: string;
}

export interface ReactivateResponse {
  success: boolean;
  newEndDate: string;
}

export interface RefundOptions {
  amount?: number;
  reason: string;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
  amount: number;
  processedAt: string;
}

export interface MetadataOptions {
  [key: string]: any;
}

export interface MetadataResponse {
  success: boolean;
  metadata: Record<string, any>;
}

export class Admin {
  constructor(private client: JuronoApiClient) {}

  // Admin Analytics & Metrics
  async getMetrics(): Promise<ApiResponse<AdminMetrics>> {
    return this.client.request('/admin/metrics', 'GET');
  }

  async getAnalytics(params: { timeframe: string }): Promise<ApiResponse<AdminAnalytics>> {
    return this.client.request(`/admin/analytics?timeframe=${encodeURIComponent(params.timeframe)}`, 'GET');
  }

  // Advanced User Management
  users = {
    getMetrics: (): Promise<ApiResponse<UserMetrics>> => {
      return this.client.request('/admin/users/metrics', 'GET');
    },

    activate: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/users/${id}/activate`, 'POST');
    },

    deactivate: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/users/${id}/deactivate`, 'POST');
    },

    resetPassword: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/users/${id}/reset-password`, 'POST');
    },

    impersonate: (id: string): Promise<ApiResponse<ImpersonationResponse>> => {
      return this.client.request(`/admin/users/${id}/impersonate`, 'POST');
    },

    sendEmail: (id: string, data: EmailData): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/users/${id}/send-email`, 'POST', data);
    },

    getEmailHistory: (id: string, params: PaginationParams = {}): Promise<ApiResponse<EmailHistoryResponse>> => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const query = queryParams.toString();
      const url = `/admin/users/${id}/email-history${query ? `?${query}` : ''}`;
      return this.client.request(url, 'GET');
    },

    getEmailById: (userId: string, emailId: string): Promise<ApiResponse<EmailDetails>> => {
      return this.client.request(`/admin/users/${userId}/emails/${emailId}`, 'GET');
    }
  };

  // Advanced Organization Management
  organizations = {
    suspend: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/organizations/${id}/suspend`, 'POST');
    },

    activate: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/organizations/${id}/activate`, 'POST');
    },

    impersonate: (id: string): Promise<ApiResponse<ImpersonationResponse>> => {
      return this.client.request(`/admin/organizations/${id}/impersonate`, 'POST');
    }
  };

  // Support Ticket Management
  support = {
    list: (params: SupportTicketParams = {}): Promise<ApiResponse<SupportTicketsResponse>> => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.status) queryParams.set('status', params.status);
      if (params.priority) queryParams.set('priority', params.priority);
      if (params.assignedTo) queryParams.set('assignedTo', params.assignedTo);
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const query = queryParams.toString();
      return this.client.request(`/admin/support${query ? `?${query}` : ''}`, 'GET');
    },

    getById: (id: string): Promise<ApiResponse<SupportTicketDetails>> => {
      return this.client.request(`/admin/support/${id}`, 'GET');
    },

    create: (data: CreateSupportTicketData): Promise<ApiResponse<SupportTicket>> => {
      return this.client.request('/admin/support', 'POST', data);
    },

    update: (id: string, data: UpdateSupportTicketData): Promise<ApiResponse<SupportTicket>> => {
      return this.client.request(`/admin/support/${id}`, 'PUT', data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/support/${id}`, 'DELETE');
    },

    addReply: (id: string, data: ReplyData): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/support/${id}/replies`, 'POST', data);
    },

    getMetrics: (): Promise<ApiResponse<SupportMetrics>> => {
      return this.client.request('/admin/support/metrics', 'GET');
    }
  };

  // Subscription Management
  subscriptions = {
    list: (params: SubscriptionParams = {}): Promise<ApiResponse<SubscriptionsResponse>> => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.status) queryParams.set('status', params.status);
      if (params.plan) queryParams.set('plan', params.plan);
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const query = queryParams.toString();
      return this.client.request(`/admin/subscriptions${query ? `?${query}` : ''}`, 'GET');
    },

    getById: (id: string): Promise<ApiResponse<SubscriptionDetails>> => {
      return this.client.request(`/admin/subscriptions/${id}`, 'GET');
    },

    cancel: (id: string, options: CancelOptions = {}): Promise<ApiResponse<CancelResponse>> => {
      return this.client.request(`/admin/subscriptions/${id}/cancel`, 'POST', options);
    },

    reactivate: (id: string): Promise<ApiResponse<ReactivateResponse>> => {
      return this.client.request(`/admin/subscriptions/${id}/reactivate`, 'POST');
    },

    refund: (id: string, options: RefundOptions): Promise<ApiResponse<RefundResponse>> => {
      return this.client.request(`/admin/subscriptions/${id}/refund`, 'POST', options);
    },

    updateMetadata: (id: string, options: MetadataOptions): Promise<ApiResponse<MetadataResponse>> => {
      return this.client.request(`/admin/subscriptions/${id}/metadata`, 'PUT', options);
    }
  };
}