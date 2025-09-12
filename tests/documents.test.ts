import { JuronoApiClient } from '../src/client';
import { Documents } from '../src/endpoints/documents';

describe('Documents', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key', baseUrl: 'http://localhost:3000/api' });
  const documents = new Documents(client);

  it('should list documents', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ([{ id: '1' }, { id: '2' }]) });
    const result = await documents.list();
    expect(result.length).toBe(2);
  });

  it('should get document by id', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ id: '1' }) });
    const result = await documents.getById('1');
    expect(result.id).toBe('1');
  });
});
