// Jurono API Client
import {
  JuronoApiOptions,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ApiResponse
} from './types/client';
import {
  JuronoApiError,
  JuronoNetworkError,
  JuronoTimeoutError,
  JuronoAbortError
} from './types/errors';

export class JuronoApiClient {
  private baseUrl: string;
  private apiKey: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(options: JuronoApiOptions) {
    this.baseUrl = options.baseUrl || 'https://api.jurono.eu/api';
    this.apiKey = options.apiKey;
    this.defaultTimeout = options.timeout || 30000;
    this.defaultRetries = options.retries ?? 3;
    this.defaultRetryDelay = options.retryDelay ?? 1000;
  }

  private createTimeoutSignal(timeout: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeRequest(
    url: string,
    init: RequestInit
  ): Promise<Response> {
    // Apply request interceptors
    const requestData = { url, ...init };
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.fulfilled) {
        await interceptor.fulfilled(requestData);
      }
    }

    try {
      const response = await fetch(url, init);
      
      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.fulfilled) {
          await interceptor.fulfilled(response);
        }
      }
      
      return response;
    } catch (error) {
      // Apply error response interceptors
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.rejected) {
          await interceptor.rejected(error);
        }
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return new JuronoNetworkError('Network error occurred', error);
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        if (error.message.includes('timeout')) {
          return new JuronoTimeoutError('Request timeout exceeded');
        }
        return new JuronoAbortError('Request was cancelled');
      }
    }
    
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }

  private async retryRequest(
    requestFn: () => Promise<Response>,
    retries: number,
    delay: number
  ): Promise<Response> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await requestFn();
        
        // If response is not ok, create an API error
        if (!response.ok) {
          const errorResponse = {
            status: response.status,
            statusText: response.statusText,
            data: undefined as unknown
          };
          
          try {
            errorResponse.data = await response.json();
          } catch {
            // Response might not be JSON
          }
          
          const apiError = new JuronoApiError(
            response.status,
            response.statusText,
            errorResponse.data
          );
          
          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw apiError;
          }
          
          throw apiError;
        }
        
        return response;
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        lastError = err;
        
        // Don't retry on client errors, aborts, or timeouts
        if (
          err instanceof JuronoAbortError ||
          err instanceof JuronoTimeoutError ||
          (err instanceof JuronoApiError && err.status >= 400 && err.status < 500)
        ) {
          throw err;
        }
        
        if (attempt < retries) {
          const backoffDelay = delay * Math.pow(2, attempt);
          await this.sleep(backoffDelay);
        }
      }
    }
    
    throw lastError || new Error('Request failed after retries');
  }

  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  public async request<T = unknown>(
    endpoint: string,
    method: string = 'GET',
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const timeout = config?.timeout || this.defaultTimeout;
    const retries = config?.retries ?? this.defaultRetries;
    
    // Create combined abort signal
    const signals = [this.createTimeoutSignal(timeout)];
    if (config?.signal) {
      signals.push(config.signal);
    }
    
    // Note: AbortSignal.any() is not widely supported yet, so we'll use the first signal
    const signal = signals[0];
    
    const requestInit: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await this.retryRequest(
      () => this.executeRequest(url, requestInit),
      retries,
      this.defaultRetryDelay
    );

    const data = await response.json() as T;
    
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: (() => {
        const headers: Record<string, string> = {};
        if (response.headers && typeof response.headers.forEach === 'function') {
          response.headers.forEach((value, key) => {
            headers[key] = value;
          });
        }
        return headers;
      })()
    };
  }
}
