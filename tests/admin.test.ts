import { JuronoApiClient } from '../src/client';
import { Admin } from '../src/endpoints/admin';
import { mockFetch } from './setup';

describe('Admin', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key' });
  const admin = new Admin(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Analytics & Metrics', () => {
    it('should get admin metrics', async () => {
      const mockData = { totalUsers: 100, totalOrganizations: 20, totalRevenue: 50000, monthlyGrowth: 15 };
      mockFetch(mockData);

      const result = await admin.getMetrics();
      expect(result.data.totalUsers).toBe(100);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/metrics'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should get admin analytics', async () => {
      const mockData = { timeframe: '30d', userGrowth: [1, 2, 3], revenue: [100, 200, 300] };
      mockFetch(mockData);

      const result = await admin.getAnalytics({ timeframe: '30d' });
      expect(result.data.timeframe).toBe('30d');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/analytics?timeframe=30d'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('User Management', () => {
    it('should get user metrics', async () => {
      const mockData = { total: 100, active: 80, inactive: 20, newThisMonth: 15 };
      mockFetch(mockData);

      const result = await admin.users.getMetrics();
      expect(result.data.total).toBe(100);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/metrics'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should activate user', async () => {
      mockFetch({});

      await admin.users.activate('user-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/user-123/activate'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should deactivate user', async () => {
      mockFetch({});

      await admin.users.deactivate('user-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/user-123/deactivate'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should impersonate user', async () => {
      const mockData = { token: 'impersonation-token', user: { id: 'user-123', email: 'user@test.com' } };
      mockFetch(mockData);

      const result = await admin.users.impersonate('user-123');
      expect(result.data.token).toBe('impersonation-token');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/user-123/impersonate'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should send email to user', async () => {
      mockFetch({});
      const emailData = { subject: 'Test Email', body: 'Test message' };

      await admin.users.sendEmail('user-123', emailData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/users/user-123/send-email'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(emailData)
        })
      );
    });
  });

  describe('Support Management', () => {
    it('should list support tickets', async () => {
      const mockData = {
        tickets: [{ id: 'ticket-1', title: 'Test Issue', status: 'open' }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      mockFetch(mockData);

      const result = await admin.support.list({ status: 'open', page: 1 });
      expect(result.data.tickets).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/support?page=1&status=open'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should create support ticket', async () => {
      const mockData = { id: 'ticket-123', title: 'New Issue', status: 'open' };
      const ticketData = { title: 'New Issue', description: 'Description', priority: 'medium' as const };
      mockFetch(mockData);

      const result = await admin.support.create(ticketData);
      expect(result.data.id).toBe('ticket-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/support'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(ticketData)
        })
      );
    });

    it('should get support metrics', async () => {
      const mockData = { total: 50, open: 10, closed: 35, pending: 5, averageResponseTime: 24 };
      mockFetch(mockData);

      const result = await admin.support.getMetrics();
      expect(result.data.total).toBe(50);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/support/metrics'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('Subscription Management', () => {
    it('should list subscriptions', async () => {
      const mockData = {
        subscriptions: [{ id: 'sub-1', status: 'active', plan: 'pro' }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 }
      };
      mockFetch(mockData);

      const result = await admin.subscriptions.list({ status: 'active' });
      expect(result.data.subscriptions).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/subscriptions?status=active'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should cancel subscription', async () => {
      const mockData = { success: true, refundAmount: 50, effectiveDate: '2024-01-01' };
      mockFetch(mockData);

      const result = await admin.subscriptions.cancel('sub-123', { reason: 'Customer request' });
      expect(result.data.success).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/subscriptions/sub-123/cancel'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ reason: 'Customer request' })
        })
      );
    });
  });
});