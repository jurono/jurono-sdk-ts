import { JuronoApiClient } from '../src/client';
import { Documents } from '../src/endpoints/documents';
import { mockFetch } from './setup';

describe('Documents', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const documents = new Documents(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list documents', async () => {
    const mockData = [{ id: '1' }, { id: '2' }];
    mockFetch(mockData);
    
    const result = await documents.list();
    expect(result.data.length).toBe(2);
  });

  it('should get document by id', async () => {
    const mockData = { id: '1' };
    mockFetch(mockData);
    
    const result = await documents.getById('1');
    expect(result.data.id).toBe('1');
  });
});