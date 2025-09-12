import { JuronoApiClient } from '../src/client';
import { Mandates } from '../src/endpoints/mandates';

describe('Mandates', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const mandates = new Mandates(client);

  it('should list mandates', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: '1' }, { id: '2' }]) });
    const result = await mandates.list();
    expect(result.length).toBe(2);
  });

  it('should get mandate by id', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: '1' }) });
    const result = await mandates.getById('1');
    expect(result.id).toBe('1');
  });
});
