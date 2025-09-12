import { JuronoApiClient } from '../src/client';
import { Auth } from '../src/endpoints/auth';
import { mockFetch } from './setup';

describe('Auth', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const auth = new Auth(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call login', async () => {
    const mockData = { token: 'jwt' };
    mockFetch(mockData);
    
    const result = await auth.login({ email: 'user@example.com', password: 'password123' });
    expect(result.data.token).toBe('jwt');
  });

  it('should call register', async () => {
    const mockData = { userId: '123' };
    mockFetch(mockData);
    
    const result = await auth.register({ 
      email: 'user@example.com', 
      password: 'password123', 
      firstName: 'Test', 
      lastName: 'User', 
      userType: 'CLIENT' 
    });
    expect(result.data.userId).toBe('123');
  });

  it('should call me', async () => {
    const mockData = { email: 'user@example.com' };
    mockFetch(mockData);
    
    const result = await auth.me();
    expect(result.data.email).toBe('user@example.com');
  });
});