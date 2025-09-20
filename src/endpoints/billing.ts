import { JuronoApiClient } from '../client';
import type { ApiResponse } from '../types';

// Billing types
export interface BillingMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  averageOrderValue: number;
  totalTransactions: number;
  monthlyTransactions: number;
  revenueGrowth: number;
  transactionGrowth: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  transactions: number;
}

export interface BillingDashboard {
  metrics: BillingMetrics;
  revenueChart: RevenueChartData[];
  topPlans: PlanMetrics[];
  recentTransactions: Transaction[];
}

export interface PlanMetrics {
  planId: string;
  planName: string;
  subscribers: number;
  revenue: number;
  growth: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  customerEmail: string;
  planName: string;
  date: string;
}

export interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  churnRate: number;
  averageLifetimeValue: number;
  newCustomersThisMonth: number;
  customerGrowthRate: number;
  retentionRate: number;
}

export interface BillingHealth {
  status: 'healthy' | 'warning' | 'critical';
  failureRate: number;
  averageProcessingTime: number;
  uptime: number;
  lastIncident?: string;
  issues: BillingIssue[];
}

export interface BillingIssue {
  id: string;
  type: 'payment_failure' | 'gateway_error' | 'system_error';
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export interface ComprehensiveBillingData {
  metrics: BillingMetrics;
  customerMetrics: CustomerMetrics;
  revenueChart: RevenueChartData[];
  health: BillingHealth;
  trends: BillingTrends;
}

export interface BillingTrends {
  revenueGrowthTrend: number[];
  customerGrowthTrend: number[];
  churnTrend: number[];
  periodLabels: string[];
}

export class Billing {
  constructor(private client: JuronoApiClient) {}

  async getMetrics(params: { timeframe: string }): Promise<ApiResponse<BillingMetrics>> {
    return this.client.request(`/billing/metrics?timeframe=${encodeURIComponent(params.timeframe)}`, 'GET');
  }

  async getRevenueChart(params: { timeframe: string }): Promise<ApiResponse<RevenueChartData[]>> {
    return this.client.request(`/billing/revenue-chart?timeframe=${encodeURIComponent(params.timeframe)}`, 'GET');
  }

  async getDashboard(params: { timeframe: string }): Promise<ApiResponse<BillingDashboard>> {
    return this.client.request(`/billing/dashboard?timeframe=${encodeURIComponent(params.timeframe)}`, 'GET');
  }

  async getCustomerMetrics(params: { timeframe: string }): Promise<ApiResponse<CustomerMetrics>> {
    return this.client.request(`/billing/customers?timeframe=${encodeURIComponent(params.timeframe)}`, 'GET');
  }

  async getHealth(): Promise<ApiResponse<BillingHealth>> {
    return this.client.request('/billing/health', 'GET');
  }

  async getComprehensiveDashboard(params: { timeframe: string }): Promise<ApiResponse<ComprehensiveBillingData>> {
    return this.client.request(`/billing/comprehensive-dashboard?timeframe=${encodeURIComponent(params.timeframe)}`, 'GET');
  }
}