import { JuronoApiClient } from '../src/client';
import { Clients } from '../src/endpoints/clients';

describe('Clients', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const clients = new Clients(client);

  it('should list clients', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: '1' }, { id: '2' }]) });
    const result = await clients.list();
    expect(result.length).toBe(2);
  });

  it('should create client', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: '1' }) });
    const result = await clients.create({ type: 'INDIVIDUAL', email: 'client@example.com' });
    expect(result.id).toBe('1');
  });
});
