import { JuronoApiClient } from '../src/client';
import { Mandates } from '../src/endpoints/mandates';
import { mockFetch } from './setup';

describe('Mandates', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const mandates = new Mandates(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list mandates', async () => {
    const mockData = [{ id: '1' }, { id: '2' }];
    mockFetch(mockData);
    
    const result = await mandates.list();
    expect(result.data.length).toBe(2);
  });

  it('should get mandate by id', async () => {
    const mockData = { id: '1' };
    mockFetch(mockData);
    
    const result = await mandates.getById('1');
    expect(result.data.id).toBe('1');
  });
});