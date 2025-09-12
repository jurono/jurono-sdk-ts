// Mock global fetch for tests
global.fetch = jest.fn();

// Helper to create mock fetch responses
export const mockFetch = (response: any, status = 200, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => response,
    headers: new Headers(),
  });
};

export const mockFetchError = (error: Error) => {
  (global.fetch as jest.Mock).mockRejectedValue(error);
};