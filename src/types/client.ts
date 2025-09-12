export interface JuronoApiOptions {
  apiKey: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface RequestConfig {
  timeout?: number;
  signal?: AbortSignal;
  retries?: number;
}

export interface Interceptor<T> {
  fulfilled?: (value: T) => T | Promise<T>;
  rejected?: (error: any) => any;
}

export interface RequestInterceptor extends Interceptor<any> {}
export interface ResponseInterceptor extends Interceptor<any> {}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}