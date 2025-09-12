import { JuronoApiClient } from '../src/client';
import { Organizations } from '../src/endpoints/organizations';
import { mockFetch } from './setup';

describe('Organizations', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const orgs = new Organizations(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list organizations', async () => {
    const mockData = [{ id: '1' }, { id: '2' }];
    mockFetch(mockData);
    
    const result = await orgs.list();
    expect(result.data.length).toBe(2);
  });

  it('should create organization', async () => {
    const mockData = { id: '1' };
    mockFetch(mockData);
    
    const result = await orgs.create({ name: 'Org1' });
    expect(result.data.id).toBe('1');
  });
});
