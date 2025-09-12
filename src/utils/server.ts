import { JuronoApiClient } from '../client';
import { Auth } from '../endpoints/auth';
import { Users } from '../endpoints/users';
import { Organizations } from '../endpoints/organizations';
import { Clients } from '../endpoints/clients';
import { Mandates } from '../endpoints/mandates';
import { Documents } from '../endpoints/documents';
import { JuronoApiOptions, ApiResponse } from '../types';

export interface ServerSDK {
  client: JuronoApiClient;
  auth: Auth;
  users: Users;
  organizations: Organizations;
  clients: Clients;
  mandates: Mandates;
  documents: Documents;
}

let serverSDKInstance: ServerSDK | null = null;

export function createServerSDK(options: JuronoApiOptions): ServerSDK {
  const client = new JuronoApiClient(options);
  
  return {
    client,
    auth: new Auth(client),
    users: new Users(client),
    organizations: new Organizations(client),
    clients: new Clients(client),
    mandates: new Mandates(client),
    documents: new Documents(client),
  };
}

export function getServerSDK(options?: JuronoApiOptions): ServerSDK {
  if (!serverSDKInstance) {
    if (!options) {
      throw new Error('SDK options required for first initialization');
    }
    serverSDKInstance = createServerSDK(options);
  }
  return serverSDKInstance;
}

// Next.js specific utilities
export interface NextJSProps {
  [key: string]: any;
}

export interface SSGContext {
  params?: { [key: string]: string | string[] };
  preview?: boolean;
  previewData?: any;
}

export interface SSRContext {
  req: any;
  res: any;
  params?: { [key: string]: string | string[] };
  query: { [key: string]: string | string[] };
  preview?: boolean;
  previewData?: any;
}

// Helper for getStaticProps
export async function withJuronoSSG<T extends NextJSProps>(
  handler: (sdk: ServerSDK, context: SSGContext) => Promise<{ props: T } | { redirect: any } | { notFound: true }>,
  options?: JuronoApiOptions
) {
  return async (context: SSGContext) => {
    try {
      const sdk = getServerSDK(options);
      return await handler(sdk, context);
    } catch (error) {
      console.error('SSG Error:', error);
      return { notFound: true };
    }
  };
}

// Helper for getServerSideProps
export async function withJuronoSSR<T extends NextJSProps>(
  handler: (sdk: ServerSDK, context: SSRContext) => Promise<{ props: T } | { redirect: any } | { notFound: true }>,
  options?: JuronoApiOptions
) {
  return async (context: SSRContext) => {
    try {
      const sdk = getServerSDK(options);
      return await handler(sdk, context);
    } catch (error) {
      console.error('SSR Error:', error);
      return { notFound: true };
    }
  };
}

// API Route helpers
export interface APIRouteContext {
  req: any;
  res: any;
}

export async function withJuronoAPI(
  handler: (sdk: ServerSDK, context: APIRouteContext) => Promise<any>,
  options?: JuronoApiOptions
) {
  return async (req: any, res: any) => {
    try {
      const sdk = getServerSDK(options);
      return await handler(sdk, { req, res });
    } catch (error) {
      console.error('API Route Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

// Prefetching utilities for better UX
export interface PrefetchOptions {
  timeout?: number;
  retries?: number;
}

export class DataPrefetcher {
  private sdk: ServerSDK;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor(sdk: ServerSDK) {
    this.sdk = sdk;
  }

  private getCacheKey(method: string, params?: any): string {
    return `${method}-${JSON.stringify(params || {})}`;
  }

  private isExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl;
  }

  async prefetch<T>(
    method: () => Promise<ApiResponse<T>>,
    key: string,
    ttl: number = 60000, // 1 minute default
    options?: PrefetchOptions
  ): Promise<T | null> {
    const cacheKey = this.getCacheKey(key);
    const cached = this.cache.get(cacheKey);

    if (cached && !this.isExpired(cached.timestamp, cached.ttl)) {
      return cached.data;
    }

    try {
      const response = await method();
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
        ttl
      });
      return response.data;
    } catch (error) {
      console.error(`Prefetch error for ${key}:`, error);
      return cached?.data || null;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  cleanExpired(): void {
    for (const [key, value] of this.cache.entries()) {
      if (this.isExpired(value.timestamp, value.ttl)) {
        this.cache.delete(key);
      }
    }
  }
}

export function createPrefetcher(sdk: ServerSDK): DataPrefetcher {
  return new DataPrefetcher(sdk);
}

// Environment detection utilities
export function isServer(): boolean {
  return typeof window === 'undefined';
}

export function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function isBrowser(): boolean {
  return isClient() && typeof document !== 'undefined';
}

// Safe SDK initialization for universal apps
export function safeCreateSDK(options: JuronoApiOptions): ServerSDK | null {
  if (isServer()) {
    return createServerSDK(options);
  }
  // Client-side should use React hooks instead
  return null;
}