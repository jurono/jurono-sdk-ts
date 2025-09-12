export class JuronoApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly response?: any;

  constructor(status: number, statusText: string, response?: any) {
    super(`API error: ${status} ${statusText}`);
    this.name = 'JuronoApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

export class JuronoNetworkError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'JuronoNetworkError';
  }
}

export class JuronoTimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'JuronoTimeoutError';
  }
}

export class JuronoAbortError extends Error {
  constructor(message: string = 'Request was aborted') {
    super(message);
    this.name = 'JuronoAbortError';
  }
}