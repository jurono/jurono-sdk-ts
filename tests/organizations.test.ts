import { JuronoApiClient } from '../src/client';
import { Organizations } from '../src/endpoints/organizations';

describe('Organizations', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const orgs = new Organizations(client);

  it('should list organizations', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: '1' }, { id: '2' }]) });
    const result = await orgs.list();
    expect(result.length).toBe(2);
  });

  it('should create organization', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: '1' }) });
    const result = await orgs.create({ name: 'Org1' });
    expect(result.id).toBe('1');
  });
});
