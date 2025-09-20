import { JuronoApiClient } from '../src/client';
import { LawyerProfiles } from '../src/endpoints/lawyer-profiles';
import { mockFetch } from './setup';

describe('LawyerProfiles', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key' });
  const lawyerProfiles = new LawyerProfiles(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list lawyer profiles', async () => {
    const mockData = {
      profiles: [
        {
          id: 'profile-1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@law.com',
          barNumber: 'BAR123456',
          firmName: 'Smith & Associates',
          specializations: ['Corporate Law', 'Contract Law'],
          experience: 10,
          location: { city: 'New York', country: 'USA' },
          ratings: { average: 4.8, count: 25, breakdown: { 5: 20, 4: 3, 3: 2 } },
          verification: { verified: true, verifiedAt: '2024-01-01T00:00:00Z' },
          status: 'active' as const
        },
        {
          id: 'profile-2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@law.com',
          specializations: ['Family Law', 'Immigration Law'],
          experience: 8,
          location: { city: 'Los Angeles', country: 'USA' },
          ratings: { average: 4.9, count: 30, breakdown: { 5: 28, 4: 2 } },
          verification: { verified: false },
          status: 'active' as const
        }
      ],
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 }
    };
    mockFetch(mockData);

    const result = await lawyerProfiles.list({
      specialization: 'Corporate Law',
      location: 'New York',
      verified: true,
      page: 1,
      limit: 10
    });
    expect(result.data.profiles).toHaveLength(2);
    expect(result.data.profiles[0].firstName).toBe('John');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lawyer-profiles'),
      expect.objectContaining({ method: 'GET' })
    );

    // Check that the URL contains the expected parameters (allowing for different encoding)
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(fetchCall).toContain('page=1');
    expect(fetchCall).toContain('limit=10');
    expect(fetchCall).toContain('specialization=Corporate');
    expect(fetchCall).toContain('location=New');
    expect(fetchCall).toContain('verified=true');
  });

  it('should get lawyer profile by id', async () => {
    const mockData = {
      id: 'profile-123',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@law.com',
      phone: '+1-555-0123',
      barNumber: 'BAR123456',
      firmName: 'Smith & Associates',
      specializations: ['Corporate Law', 'Contract Law', 'Mergers & Acquisitions'],
      experience: 15,
      education: [
        {
          institution: 'Harvard Law School',
          degree: 'Juris Doctor',
          field: 'Law',
          graduationYear: 2009,
          honors: 'Magna Cum Laude'
        }
      ],
      certifications: [
        {
          name: 'Certified Corporate Lawyer',
          issuingOrganization: 'State Bar Association',
          issueDate: '2012-01-01',
          credentialId: 'CCL-123456'
        }
      ],
      languages: ['English', 'Spanish'],
      location: {
        address: '123 Legal Street',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001'
      },
      bio: 'Experienced corporate lawyer with 15 years of practice.',
      website: 'https://smithlaw.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/johnsmith',
        twitter: '@johnsmithlaw'
      },
      ratings: { average: 4.8, count: 45, breakdown: { 5: 35, 4: 8, 3: 2 } },
      fees: {
        consultationFee: 200,
        hourlyRate: 500,
        currency: 'USD',
        paymentMethods: ['Credit Card', 'Bank Transfer']
      },
      availability: {
        timezone: 'America/New_York',
        workingHours: {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true }
        },
        consultationTypes: ['in-person' as const, 'video-call' as const]
      },
      verification: {
        verified: true,
        verifiedAt: '2024-01-01T00:00:00Z',
        verifiedBy: 'admin-user-123',
        documents: [
          {
            type: 'bar_certificate' as const,
            url: 'https://documents.com/bar-cert.pdf',
            status: 'approved' as const,
            uploadedAt: '2023-12-15T00:00:00Z'
          }
        ]
      },
      status: 'active' as const,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    mockFetch(mockData);

    const result = await lawyerProfiles.getById('profile-123');
    expect(result.data.firstName).toBe('John');
    expect(result.data.experience).toBe(15);
    expect(result.data.education).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lawyer-profiles/profile-123'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('should create lawyer profile', async () => {
    const mockData = {
      id: 'profile-123',
      firstName: 'New',
      lastName: 'Lawyer',
      specializations: ['Family Law'],
      experience: 5,
      location: { city: 'Boston', country: 'USA' },
      ratings: { average: 0, count: 0, breakdown: {} },
      verification: { verified: false },
      status: 'active' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
    const profileData = {
      firstName: 'New',
      lastName: 'Lawyer',
      email: 'new.lawyer@law.com',
      specializations: ['Family Law'],
      experience: 5,
      location: { city: 'Boston', country: 'USA' },
      bio: 'Experienced family lawyer',
      fees: {
        consultationFee: 150,
        hourlyRate: 300,
        currency: 'USD',
        paymentMethods: ['Credit Card']
      }
    };
    mockFetch(mockData);

    const result = await lawyerProfiles.create(profileData);
    expect(result.data.firstName).toBe('New');
    expect(result.data.id).toBe('profile-123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lawyer-profiles'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(profileData)
      })
    );
  });

  it('should update lawyer profile', async () => {
    const mockData = {
      id: 'profile-123',
      firstName: 'Updated',
      lastName: 'Lawyer',
      experience: 6,
      specializations: ['Family Law', 'Divorce Law'],
      updatedAt: '2024-01-02T00:00:00Z'
    };
    const updateData = {
      firstName: 'Updated',
      experience: 6,
      specializations: ['Family Law', 'Divorce Law']
    };
    mockFetch(mockData);

    const result = await lawyerProfiles.update('profile-123', updateData);
    expect(result.data.firstName).toBe('Updated');
    expect(result.data.experience).toBe(6);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lawyer-profiles/profile-123'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updateData)
      })
    );
  });

  it('should delete lawyer profile', async () => {
    mockFetch({});

    await lawyerProfiles.delete('profile-123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lawyer-profiles/profile-123'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('should claim lawyer profile', async () => {
    mockFetch({});

    await lawyerProfiles.claim('profile-123', 'user-456');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lawyer-profiles/profile-123/claim'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ userId: 'user-456' })
      })
    );
  });

  it('should unclaim lawyer profile', async () => {
    mockFetch({});

    await lawyerProfiles.unclaim('profile-123');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/lawyer-profiles/profile-123/unclaim'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});