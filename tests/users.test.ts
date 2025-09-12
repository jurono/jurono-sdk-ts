import { JuronoApiClient } from '../src/client';
import { Users } from '../src/endpoints/users';
import { mockFetch } from './setup';

describe('Users', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key' });
  const users = new Users(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list users', async () => {
    const mockData = [{ id: '1' }, { id: '2' }];
    mockFetch(mockData);
    
    const result = await users.list();
    expect(result.data.length).toBe(2);
  });

  it('should get user by id', async () => {
    const mockData = { id: '1', email: 'user@example.com' };
    mockFetch(mockData);
    
    const result = await users.getById('1');
    expect(result.data.id).toBe('1');
  });

  it('should add comment', async () => {
    const mockData = { commentId: 'c1' };
    mockFetch(mockData);
    
    const result = await users.addComment('1', { message: 'Hello' });
    expect(result.data.commentId).toBe('c1');
  });
});