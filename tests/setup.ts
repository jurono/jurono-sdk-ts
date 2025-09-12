// Mock global fetch for tests
global.fetch = jest.fn();

// Clear all timers after each test to prevent Jest hanging
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Helper to create mock fetch responses
export const mockFetch = (response: any, status = 200, ok = true) => {
  const mockHeaders = new Map();
  mockHeaders.set('content-type', 'application/json');
  mockHeaders.forEach = function(callback: any) {
    this.entries().forEach(([key, value]: [string, string]) => callback(value, key));
  };

  (global.fetch as jest.Mock).mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: async () => response,
    headers: mockHeaders,
  });
};

export const mockFetchError = (error: Error) => {
  (global.fetch as jest.Mock).mockRejectedValue(error);
};