import { JuronoApiClient } from '../src/client';
import { Users } from '../src/endpoints/users';

describe('Users', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const users = new Users(client);

  it('should list users', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: '1' }, { id: '2' }]) });
    const result = await users.list();
    expect(result.length).toBe(2);
  });

  it('should get user by id', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: '1', email: 'user@example.com' }) });
    const result = await users.getById('1');
    expect(result.id).toBe('1');
  });

  it('should add comment', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ commentId: 'c1' }) });
    const result = await users.addComment('1', { message: 'Hello' });
    expect(result.commentId).toBe('c1');
  });
});
