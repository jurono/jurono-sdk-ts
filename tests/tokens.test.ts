import { JuronoApiClient } from '../src/client';
import { Tokens } from '../src/endpoints/tokens';
import { mockFetch } from './setup';

describe('Tokens', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key' });
  const tokens = new Tokens(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list tokens', async () => {
    const mockData = {
      tokens: [
        {
          id: 'token-1',
          name: 'API Token 1',
          type: 'api' as const,
          status: 'active' as const,
          scopes: ['read:users', 'write:users'],
          usageCount: 150,
          createdBy: { id: 'user-1', name: 'John Doe', email: 'john@test.com' }
        },
        {
          id: 'token-2',
          name: 'Service Token',
          type: 'service' as const,
          status: 'active' as const,
          scopes: ['admin:all'],
          usageCount: 50,
          createdBy: { id: 'user-1', name: 'John Doe', email: 'john@test.com' }
        }
      ],
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 }
    };
    mockFetch(mockData);

    const result = await tokens.list({ type: 'api', status: 'active', page: 1 });
    expect(result.data.tokens).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens?page=1&type=api&status=active'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should create API token', async () => {
    const mockData = {
      id: 'token-123',
      name: 'New API Token',
      type: 'api' as const,
      status: 'active' as const,
      scopes: ['read:users'],
      token: 'jwt-token-string',
      usageCount: 0,
      createdBy: { id: 'user-1', name: 'John Doe', email: 'john@test.com' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    const tokenData = {
      name: 'New API Token',
      scopes: ['read:users'],
      description: 'Token for reading user data',
      rateLimit: { requests: 1000, period: 'hour' as const }
    };
    mockFetch(mockData);

    const result = await tokens.create(tokenData);
    expect(result.data.token).toBe('jwt-token-string');
    expect(result.data.name).toBe('New API Token');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ ...tokenData, type: 'api' })
      })
    );
  });

  it('should create service token', async () => {
    const mockData = {
      id: 'token-123',
      name: 'Service Token',
      type: 'service' as const,
      status: 'active' as const,
      scopes: ['admin:all'],
      token: 'service-token-string',
      usageCount: 0,
      createdBy: { id: 'user-1', name: 'Service User', email: 'service@test.com' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    const serviceTokenData = {
      name: 'Service Token',
      scopes: ['admin:all'],
      serviceId: 'service-123',
      permissions: ['create', 'read', 'update', 'delete'],
      description: 'Token for service operations'
    };
    mockFetch(mockData);

    const result = await tokens.createService(serviceTokenData);
    expect(result.data.token).toBe('service-token-string');
    expect(result.data.type).toBe('service');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ ...serviceTokenData, type: 'service' })
      })
    );
  });

  it('should create webhook token', async () => {
    const mockData = {
      id: 'token-123',
      name: 'Webhook Token',
      type: 'webhook' as const,
      status: 'active' as const,
      scopes: ['webhook:receive'],
      token: 'webhook-token-string',
      usageCount: 0,
      createdBy: { id: 'user-1', name: 'John Doe', email: 'john@test.com' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    const webhookTokenData = {
      name: 'Webhook Token',
      scopes: ['webhook:receive'],
      webhookUrl: 'https://api.example.com/webhook',
      events: ['user.created', 'user.updated'],
      secretKey: 'webhook-secret'
    };
    mockFetch(mockData);

    const result = await tokens.createWebhook(webhookTokenData);
    expect(result.data.token).toBe('webhook-token-string');
    expect(result.data.type).toBe('webhook');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ ...webhookTokenData, type: 'webhook' })
      })
    );
  });

  it('should get token by id', async () => {
    const mockData = {
      id: 'token-123',
      name: 'API Token',
      type: 'api' as const,
      status: 'active' as const,
      scopes: ['read:users'],
      description: 'Token description',
      usageCount: 100,
      lastUsed: '2024-01-01T12:00:00Z',
      createdBy: { id: 'user-1', name: 'John Doe', email: 'john@test.com' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    mockFetch(mockData);

    const result = await tokens.getById('token-123');
    expect(result.data.id).toBe('token-123');
    expect(result.data.usageCount).toBe(100);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens/token-123'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should get token usage stats', async () => {
    const mockData = {
      tokenId: 'token-123',
      period: { start: '2024-01-01', end: '2024-01-31' },
      totalRequests: 1500,
      successfulRequests: 1450,
      failedRequests: 50,
      rateLimitHits: 10,
      averageResponseTime: 120,
      dailyUsage: [
        { date: '2024-01-01', requests: 50, errors: 2 },
        { date: '2024-01-02', requests: 75, errors: 1 }
      ],
      endpointUsage: [
        { endpoint: '/users', method: 'GET', requests: 800, averageResponseTime: 100 },
        { endpoint: '/organizations', method: 'GET', requests: 400, averageResponseTime: 150 }
      ],
      errorBreakdown: [
        { statusCode: 404, count: 25, percentage: 50 },
        { statusCode: 500, count: 15, percentage: 30 }
      ]
    };
    mockFetch(mockData);

    const result = await tokens.getUsageStats('token-123', 30);
    expect(result.data.totalRequests).toBe(1500);
    expect(result.data.dailyUsage).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens/token-123/usage-stats?days=30'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should revoke token', async () => {
    mockFetch({});

    await tokens.revoke('token-123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens/token-123/revoke'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('should get available scopes', async () => {
    const mockData = [
      {
        id: 'scope-1',
        name: 'read:users',
        description: 'Read user data',
        category: 'Users',
        permissions: ['read']
      },
      {
        id: 'scope-2',
        name: 'write:users',
        description: 'Write user data',
        category: 'Users',
        permissions: ['create', 'update']
      }
    ];
    mockFetch(mockData);

    const result = await tokens.getScopes();
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('read:users');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/tokens/scopes'),
      expect.objectContaining({ method: 'GET' })
    );
  });
});