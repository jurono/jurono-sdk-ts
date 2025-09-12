import { JuronoApiClient } from '../src/client';
import { Clients } from '../src/endpoints/clients';
import { mockFetch } from './setup';

describe('Clients', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const clients = new Clients(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list clients', async () => {
    const mockData = [{ id: '1' }, { id: '2' }];
    mockFetch(mockData);
    
    const result = await clients.list();
    expect(result.data.length).toBe(2);
  });

  it('should create client', async () => {
    const mockData = { id: '1' };
    mockFetch(mockData);
    
    const result = await clients.create({ type: 'INDIVIDUAL', email: 'client@example.com' });
    expect(result.data.id).toBe('1');
  });
});