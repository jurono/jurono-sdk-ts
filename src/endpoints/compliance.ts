import { JuronoApiClient } from '../client';
import type { ApiResponse } from '../types';

// Compliance types
export interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  type: 'gdpr' | 'data_retention' | 'security' | 'audit';
  status: 'active' | 'inactive' | 'draft';
  organizationId?: string;
  schedule: string;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateComplianceCheckData {
  name: string;
  description: string;
  type: 'gdpr' | 'data_retention' | 'security' | 'audit';
  organizationId?: string;
  schedule: string;
  rules: ComplianceRule[];
}

export interface ComplianceRule {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceCheckRun {
  id: string;
  checkId: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  results: ComplianceResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

export interface ComplianceResult {
  ruleId: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: any;
}

export interface DataExport {
  id: string;
  organizationId?: string;
  type: 'full' | 'partial' | 'user_data';
  format: 'json' | 'csv' | 'xml';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
}

export interface CreateDataExportData {
  organizationId?: string;
  type: 'full' | 'partial' | 'user_data';
  format: 'json' | 'csv' | 'xml';
  filters?: {
    dateRange?: {
      start: string;
      end: string;
    };
    dataTypes?: string[];
    userIds?: string[];
  };
}

export interface DataAnonymization {
  id: string;
  organizationId?: string;
  type: 'user_data' | 'transaction_data' | 'communication_data';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  recordsProcessed: number;
  recordsAnonymized: number;
}

export interface CreateDataAnonymizationData {
  organizationId?: string;
  type: 'user_data' | 'transaction_data' | 'communication_data';
  criteria: {
    retentionPeriod: number; // days
    userIds?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

export interface ComplianceReport {
  id: string;
  organizationId?: string;
  type: 'gdpr' | 'data_audit' | 'security_assessment' | 'compliance_overview';
  title: string;
  status: 'draft' | 'generated' | 'reviewed' | 'published';
  generatedAt: string;
  reviewedAt?: string;
  publishedAt?: string;
  summary: string;
  downloadUrl?: string;
}

export interface CreateComplianceReportData {
  organizationId?: string;
  type: 'gdpr' | 'data_audit' | 'security_assessment' | 'compliance_overview';
  title: string;
  period: {
    start: string;
    end: string;
  };
  sections: string[];
}

export interface ComplianceAIAnalysis {
  id: string;
  organizationId: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  generatedAt: string;
  riskScore: number; // 0-100
  findings: AIFinding[];
  recommendations: AIRecommendation[];
  summary: string;
}

export interface AIFinding {
  id: string;
  type: 'data_exposure' | 'retention_violation' | 'access_anomaly' | 'security_gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedSystems: string[];
  dataTypes: string[];
  riskLevel: number;
}

export interface AIRecommendation {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  implementation: string;
  estimatedEffort: 'hours' | 'days' | 'weeks';
  impactOnRisk: number; // reduction in risk score
}

export interface AuditParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SecurityAuditsResponse {
  audits: SecurityAudit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SecurityAudit {
  id: string;
  name: string;
  type: 'vulnerability_scan' | 'penetration_test' | 'compliance_check' | 'access_review';
  status: 'pending' | 'running' | 'completed' | 'failed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  progress: number; // 0-100
}

export interface SecurityAuditDetails extends SecurityAudit {
  description: string;
  findings: SecurityFinding[];
  recommendations: SecurityRecommendation[];
  executionLogs: string[];
  report?: {
    url: string;
    generatedAt: string;
  };
}

export interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  affectedAssets: string[];
  cveId?: string;
  cvssScore?: number;
}

export interface SecurityRecommendation {
  id: string;
  findingId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedEffort: string;
}

export interface SecurityAuditResponse {
  auditId: string;
  status: 'started' | 'queued';
  estimatedCompletion: string;
}

export interface SecurityAuditProgress {
  auditId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  currentPhase: string;
  estimatedTimeRemaining: number; // minutes
  lastUpdate: string;
}

export class Compliance {
  constructor(private client: JuronoApiClient) {}

  // Compliance Checks
  checks = {
    list: (params?: { organizationId?: string }): Promise<ApiResponse<ComplianceCheck[]>> => {
      const queryParams = new URLSearchParams();
      if (params?.organizationId) {
        queryParams.set('organizationId', params.organizationId);
      }

      const query = queryParams.toString();
      return this.client.request(`/compliance/admin/checks${query ? `?${query}` : ''}`, 'GET');
    },

    create: (data: CreateComplianceCheckData): Promise<ApiResponse<ComplianceCheck>> => {
      return this.client.request('/compliance/admin/checks', 'POST', data);
    },

    run: (checkId: string): Promise<ApiResponse<ComplianceCheckRun>> => {
      return this.client.request(`/compliance/admin/checks/${checkId}/run`, 'POST');
    }
  };

  // Data Management
  exports = {
    list: (params?: { organizationId?: string }): Promise<ApiResponse<DataExport[]>> => {
      const queryParams = new URLSearchParams();
      if (params?.organizationId) {
        queryParams.set('organizationId', params.organizationId);
      }

      const query = queryParams.toString();
      return this.client.request(`/compliance/admin/exports${query ? `?${query}` : ''}`, 'GET');
    },

    create: (data: CreateDataExportData): Promise<ApiResponse<DataExport>> => {
      return this.client.request('/compliance/admin/exports', 'POST', data);
    }
  };

  anonymizations = {
    list: (params?: { organizationId?: string }): Promise<ApiResponse<DataAnonymization[]>> => {
      const queryParams = new URLSearchParams();
      if (params?.organizationId) {
        queryParams.set('organizationId', params.organizationId);
      }

      const query = queryParams.toString();
      return this.client.request(`/compliance/admin/anonymizations${query ? `?${query}` : ''}`, 'GET');
    },

    create: (data: CreateDataAnonymizationData): Promise<ApiResponse<DataAnonymization>> => {
      return this.client.request('/compliance/admin/anonymizations', 'POST', data);
    }
  };

  reports = {
    list: (params?: { organizationId?: string }): Promise<ApiResponse<ComplianceReport[]>> => {
      const queryParams = new URLSearchParams();
      if (params?.organizationId) {
        queryParams.set('organizationId', params.organizationId);
      }

      const query = queryParams.toString();
      return this.client.request(`/compliance/admin/reports${query ? `?${query}` : ''}`, 'GET');
    },

    create: (data: CreateComplianceReportData): Promise<ApiResponse<ComplianceReport>> => {
      return this.client.request('/compliance/admin/reports', 'POST', data);
    }
  };

  // AI Analysis
  aiAnalysis = {
    get: (organizationId: string): Promise<ApiResponse<ComplianceAIAnalysis>> => {
      return this.client.request(`/compliance/admin/ai-analysis/${organizationId}`, 'GET');
    },

    generate: (organizationId: string): Promise<ApiResponse<ComplianceAIAnalysis>> => {
      return this.client.request(`/compliance/admin/ai-analysis/${organizationId}`, 'POST');
    }
  };

  // Security Audits
  securityAudits = {
    list: (params: AuditParams = {}): Promise<ApiResponse<SecurityAuditsResponse>> => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.status) queryParams.set('status', params.status);
      if (params.type) queryParams.set('type', params.type);
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const query = queryParams.toString();
      return this.client.request(`/compliance/admin/security-audits${query ? `?${query}` : ''}`, 'GET');
    },

    getById: (id: string): Promise<ApiResponse<SecurityAuditDetails>> => {
      return this.client.request(`/compliance/admin/security-audits/${id}`, 'GET');
    },

    execute: (): Promise<ApiResponse<SecurityAuditResponse>> => {
      return this.client.request('/compliance/admin/security-audits/execute', 'POST');
    },

    rerunTest: (id: string): Promise<ApiResponse<SecurityAuditResponse>> => {
      return this.client.request(`/compliance/admin/security-audits/${id}/rerun`, 'POST');
    },

    getProgress: (id: string): Promise<ApiResponse<SecurityAuditProgress>> => {
      return this.client.request(`/compliance/admin/security-audits/${id}/progress`, 'GET');
    }
  };
}