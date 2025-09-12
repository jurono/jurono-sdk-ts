import { JuronoApiClient } from '../src/client';
import { Auth } from '../src/endpoints/auth';

describe('Auth', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const auth = new Auth(client);

  it('should call login', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ token: 'jwt' }) });
    const result = await auth.login({ email: 'user@example.com', password: 'password123' });
    expect(result.token).toBe('jwt');
  });

  it('should call register', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ userId: '123' }) });
    const result = await auth.register({ email: 'user@example.com', password: 'password123', firstName: 'Test', lastName: 'User', userType: 'CLIENT' });
    expect(result.userId).toBe('123');
  });

  it('should call me', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ email: 'user@example.com' }) });
    const result = await auth.me();
    expect(result.email).toBe('user@example.com');
  });
});
