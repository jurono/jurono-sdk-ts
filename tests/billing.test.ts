import { JuronoApiClient } from '../src/client';
import { Billing } from '../src/endpoints/billing';
import { mockFetch } from './setup';

describe('Billing', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key' });
  const billing = new Billing(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get billing metrics', async () => {
    const mockData = {
      totalRevenue: 100000,
      monthlyRevenue: 8500,
      yearlyRevenue: 95000,
      averageOrderValue: 250,
      totalTransactions: 400,
      monthlyTransactions: 34,
      revenueGrowth: 12.5,
      transactionGrowth: 8.2
    };
    mockFetch(mockData);

    const result = await billing.getMetrics({ timeframe: '30d' });
    expect(result.data.totalRevenue).toBe(100000);
    expect(result.data.revenueGrowth).toBe(12.5);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/billing/metrics?timeframe=30d'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should get revenue chart data', async () => {
    const mockData = [
      { date: '2024-01-01', revenue: 1000, transactions: 5 },
      { date: '2024-01-02', revenue: 1200, transactions: 6 },
      { date: '2024-01-03', revenue: 950, transactions: 4 }
    ];
    mockFetch(mockData);

    const result = await billing.getRevenueChart({ timeframe: '7d' });
    expect(result.data).toHaveLength(3);
    expect(result.data[0].revenue).toBe(1000);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/billing/revenue-chart?timeframe=7d'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should get billing dashboard', async () => {
    const mockData = {
      metrics: { totalRevenue: 50000, monthlyRevenue: 4200 },
      revenueChart: [{ date: '2024-01-01', revenue: 1000, transactions: 5 }],
      topPlans: [{ planId: 'pro', planName: 'Pro Plan', subscribers: 150, revenue: 30000 }],
      recentTransactions: [{ id: 'tx-1', amount: 99, status: 'completed', customerEmail: 'user@test.com' }]
    };
    mockFetch(mockData);

    const result = await billing.getDashboard({ timeframe: '30d' });
    expect(result.data.metrics.totalRevenue).toBe(50000);
    expect(result.data.topPlans).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/billing/dashboard?timeframe=30d'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should get customer metrics', async () => {
    const mockData = {
      totalCustomers: 500,
      activeCustomers: 450,
      churnRate: 2.5,
      averageLifetimeValue: 1200,
      newCustomersThisMonth: 45,
      customerGrowthRate: 10.2,
      retentionRate: 97.5
    };
    mockFetch(mockData);

    const result = await billing.getCustomerMetrics({ timeframe: '30d' });
    expect(result.data.totalCustomers).toBe(500);
    expect(result.data.churnRate).toBe(2.5);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/billing/customers?timeframe=30d'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should get billing health', async () => {
    const mockData = {
      status: 'healthy' as const,
      failureRate: 0.02,
      averageProcessingTime: 1.5,
      uptime: 99.9,
      issues: []
    };
    mockFetch(mockData);

    const result = await billing.getHealth();
    expect(result.data.status).toBe('healthy');
    expect(result.data.uptime).toBe(99.9);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/billing/health'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should get comprehensive dashboard', async () => {
    const mockData = {
      metrics: { totalRevenue: 50000, monthlyRevenue: 4200 },
      customerMetrics: { totalCustomers: 500, activeCustomers: 450 },
      revenueChart: [{ date: '2024-01-01', revenue: 1000, transactions: 5 }],
      health: { status: 'healthy', failureRate: 0.02 },
      trends: {
        revenueGrowthTrend: [5, 8, 12, 15],
        customerGrowthTrend: [2, 4, 6, 10],
        churnTrend: [3, 2.5, 2, 1.8],
        periodLabels: ['Q1', 'Q2', 'Q3', 'Q4']
      }
    };
    mockFetch(mockData);

    const result = await billing.getComprehensiveDashboard({ timeframe: '1y' });
    expect(result.data.metrics.totalRevenue).toBe(50000);
    expect(result.data.trends.revenueGrowthTrend).toHaveLength(4);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/billing/comprehensive-dashboard?timeframe=1y'),
      expect.objectContaining({ method: 'GET' })
    );
  });
});