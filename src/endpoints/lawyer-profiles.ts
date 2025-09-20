import { JuronoApiClient } from '../client';
import type { ApiResponse } from '../types';

// Lawyer Profile types
export interface LawyerProfileParams {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  location?: string;
  verified?: boolean;
  claimed?: boolean;
  sortBy?: 'name' | 'experience' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface LawyerProfilesResponse {
  profiles: LawyerProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LawyerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  barNumber?: string;
  firmName?: string;
  specializations: string[];
  experience: number; // years
  education: Education[];
  certifications: Certification[];
  languages: string[];
  location: {
    address?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bio?: string;
  profileImage?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  ratings: {
    average: number;
    count: number;
    breakdown: {
      [key: number]: number; // star rating -> count
    };
  };
  fees: {
    consultationFee?: number;
    hourlyRate?: number;
    currency: string;
    paymentMethods: string[];
  };
  availability: {
    timezone: string;
    workingHours: {
      [day: string]: {
        start: string;
        end: string;
        available: boolean;
      };
    };
    consultationTypes: ('in-person' | 'video-call' | 'phone-call')[];
  };
  verification: {
    verified: boolean;
    verifiedAt?: string;
    verifiedBy?: string;
    documents: VerificationDocument[];
  };
  claimedBy?: {
    userId: string;
    claimedAt: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  // Optional alias fields for UI compatibility
  city?: string;
  country?: string;
  admissionYear?: number;
  hourlyRate?: number;
  currency?: string;
  practiceAreas?: string[];
  averageRating?: number;
  reviewCount?: number;
  claimedByUserId?: string;
  responseRate?: number;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
  honors?: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface VerificationDocument {
  type: 'bar_certificate' | 'license' | 'education_diploma' | 'id_document';
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface CreateLawyerProfileData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  barNumber?: string;
  firmName?: string;
  specializations: string[];
  experience: number;
  education?: Education[];
  certifications?: Certification[];
  languages?: string[];
  location: {
    address?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  bio?: string;
  profileImage?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  fees?: {
    consultationFee?: number;
    hourlyRate?: number;
    currency: string;
    paymentMethods: string[];
  };
  availability?: {
    timezone: string;
    workingHours: {
      [day: string]: {
        start: string;
        end: string;
        available: boolean;
      };
    };
    consultationTypes: ('in-person' | 'video-call' | 'phone-call')[];
  };
}

export interface UpdateLawyerProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  barNumber?: string;
  firmName?: string;
  specializations?: string[];
  experience?: number;
  education?: Education[];
  certifications?: Certification[];
  languages?: string[];
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  bio?: string;
  profileImage?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  fees?: {
    consultationFee?: number;
    hourlyRate?: number;
    currency?: string;
    paymentMethods?: string[];
  };
  availability?: {
    timezone?: string;
    workingHours?: {
      [day: string]: {
        start: string;
        end: string;
        available: boolean;
      };
    };
    consultationTypes?: ('in-person' | 'video-call' | 'phone-call')[];
  };
  status?: 'active' | 'inactive' | 'suspended';
}

export class LawyerProfiles {
  constructor(private client: JuronoApiClient) {}

  async list(params: LawyerProfileParams = {}): Promise<ApiResponse<LawyerProfilesResponse>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.specialization) queryParams.set('specialization', params.specialization);
    if (params.location) queryParams.set('location', params.location);
    if (params.verified !== undefined) queryParams.set('verified', params.verified.toString());
    if (params.claimed !== undefined) queryParams.set('claimed', params.claimed.toString());
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const query = queryParams.toString();
    return this.client.request(`/lawyer-profiles${query ? `?${query}` : ''}`, 'GET');
  }

  async getById(id: string): Promise<ApiResponse<LawyerProfile>> {
    return this.client.request(`/lawyer-profiles/${id}`, 'GET');
  }

  async create(data: CreateLawyerProfileData): Promise<ApiResponse<LawyerProfile>> {
    return this.client.request('/lawyer-profiles', 'POST', data);
  }

  async update(id: string, data: UpdateLawyerProfileData): Promise<ApiResponse<LawyerProfile>> {
    return this.client.request(`/lawyer-profiles/${id}`, 'PUT', data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.client.request(`/lawyer-profiles/${id}`, 'DELETE');
  }

  async claim(profileId: string, userId: string): Promise<ApiResponse<void>> {
    return this.client.request(`/lawyer-profiles/${profileId}/claim`, 'POST', { userId });
  }

  async unclaim(profileId: string): Promise<ApiResponse<void>> {
    return this.client.request(`/lawyer-profiles/${profileId}/unclaim`, 'POST');
  }
}
