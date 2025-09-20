import { JuronoApiClient } from '../src/client';
import { Compliance } from '../src/endpoints/compliance';
import { mockFetch } from './setup';

describe('Compliance', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key' });
  const compliance = new Compliance(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Compliance Checks', () => {
    it('should list compliance checks', async () => {
      const mockData = [
        { id: 'check-1', name: 'GDPR Check', type: 'gdpr', status: 'active' },
        { id: 'check-2', name: 'Data Retention', type: 'data_retention', status: 'active' }
      ];
      mockFetch(mockData);

      const result = await compliance.checks.list({ organizationId: 'org-123' });
      expect(result.data).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/checks?organizationId=org-123'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should create compliance check', async () => {
      const mockData = { id: 'check-123', name: 'New Check', type: 'security', status: 'draft' };
      const checkData = {
        name: 'New Check',
        description: 'Security compliance check',
        type: 'security' as const,
        schedule: '0 0 * * 0',
        rules: [{ field: 'encryption', operator: 'exists' as const, value: true, severity: 'high' as const }]
      };
      mockFetch(mockData);

      const result = await compliance.checks.create(checkData);
      expect(result.data.id).toBe('check-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/checks'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(checkData)
        })
      );
    });

    it('should run compliance check', async () => {
      const mockData = {
        id: 'run-123',
        checkId: 'check-123',
        status: 'running' as const,
        startedAt: '2024-01-01T00:00:00Z',
        results: [],
        summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
      };
      mockFetch(mockData);

      const result = await compliance.checks.run('check-123');
      expect(result.data.status).toBe('running');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/checks/check-123/run'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('Data Exports', () => {
    it('should list data exports', async () => {
      const mockData = [
        { id: 'export-1', type: 'full', format: 'json', status: 'completed' },
        { id: 'export-2', type: 'partial', format: 'csv', status: 'processing' }
      ];
      mockFetch(mockData);

      const result = await compliance.exports.list();
      expect(result.data).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/exports'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should create data export', async () => {
      const mockData = { id: 'export-123', type: 'user_data', format: 'json', status: 'pending' };
      const exportData = {
        type: 'user_data' as const,
        format: 'json' as const,
        filters: {
          dateRange: { start: '2024-01-01', end: '2024-01-31' },
          userIds: ['user-1', 'user-2']
        }
      };
      mockFetch(mockData);

      const result = await compliance.exports.create(exportData);
      expect(result.data.id).toBe('export-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/exports'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(exportData)
        })
      );
    });
  });

  describe('AI Analysis', () => {
    it('should get AI analysis', async () => {
      const mockData = {
        id: 'analysis-123',
        organizationId: 'org-123',
        status: 'completed' as const,
        riskScore: 75,
        findings: [
          {
            id: 'finding-1',
            type: 'data_exposure' as const,
            severity: 'high' as const,
            description: 'Potential data exposure detected'
          }
        ],
        recommendations: [
          {
            id: 'rec-1',
            priority: 'high' as const,
            title: 'Implement encryption',
            description: 'Add encryption to sensitive data'
          }
        ],
        summary: 'Organization shows moderate compliance risk'
      };
      mockFetch(mockData);

      const result = await compliance.aiAnalysis.get('org-123');
      expect(result.data.riskScore).toBe(75);
      expect(result.data.findings).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/ai-analysis/org-123'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should generate AI analysis', async () => {
      const mockData = { id: 'analysis-124', status: 'analyzing', organizationId: 'org-123' };
      mockFetch(mockData);

      const result = await compliance.aiAnalysis.generate('org-123');
      expect(result.data.status).toBe('analyzing');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/ai-analysis/org-123'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  describe('Security Audits', () => {
    it('should list security audits', async () => {
      const mockData = {
        audits: [
          { id: 'audit-1', name: 'Vulnerability Scan', type: 'vulnerability_scan', status: 'completed' },
          { id: 'audit-2', name: 'Penetration Test', type: 'penetration_test', status: 'running' }
        ],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 }
      };
      mockFetch(mockData);

      const result = await compliance.securityAudits.list({ status: 'completed', page: 1 });
      expect(result.data.audits).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/security-audits?page=1&status=completed'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should execute security audit', async () => {
      const mockData = { auditId: 'audit-123', status: 'started', estimatedCompletion: '2024-01-01T01:00:00Z' };
      mockFetch(mockData);

      const result = await compliance.securityAudits.execute();
      expect(result.data.auditId).toBe('audit-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/security-audits/execute'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should get audit progress', async () => {
      const mockData = {
        auditId: 'audit-123',
        status: 'running' as const,
        progress: 65,
        currentPhase: 'vulnerability_scanning',
        estimatedTimeRemaining: 30
      };
      mockFetch(mockData);

      const result = await compliance.securityAudits.getProgress('audit-123');
      expect(result.data.progress).toBe(65);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/compliance/admin/security-audits/audit-123/progress'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });
});