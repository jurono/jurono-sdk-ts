import { useState, useEffect, useCallback, useRef } from 'react';
import { useJurono } from './provider';
import { ApiResponse } from '../types/client';
import { JuronoAbortError } from '../types/errors';

export interface UseQueryOptions<TData = any> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  retry?: number;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export interface UseQueryResult<TData = any> {
  data: TData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseMutationOptions<TData = any, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: Error | null, variables: TVariables) => void;
}

export interface UseMutationResult<TData = any, TVariables = any> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  data: TData | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useQuery<TData = any>(
  queryFn: () => Promise<ApiResponse<TData>>,
  options: UseQueryOptions<TData> = {}
): UseQueryResult<TData> {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    retry = 0,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const executeQuery = useCallback(async () => {
    if (!enabled || !mountedRef.current) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    let attempts = 0;
    const maxAttempts = retry + 1;

    while (attempts < maxAttempts && mountedRef.current) {
      try {
        const response = await queryFn();
        
        if (mountedRef.current) {
          setData(response.data);
          setError(null);
          onSuccess?.(response.data);
        }
        break;
      } catch (err: any) {
        attempts++;
        
        if (err instanceof JuronoAbortError) {
          break;
        }

        if (attempts >= maxAttempts) {
          if (mountedRef.current) {
            setError(err);
            onError?.(err);
          }
        } else if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
      }
    }

    if (mountedRef.current) {
      setLoading(false);
    }
  }, [queryFn, enabled, retry, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await executeQuery();
  }, [executeQuery]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  useEffect(() => {
    if (refetchInterval && enabled) {
      const interval = setInterval(executeQuery, refetchInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [executeQuery, refetchInterval, enabled]);

  useEffect(() => {
    if (refetchOnWindowFocus && enabled) {
      const handleFocus = () => executeQuery();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
    return undefined;
  }, [executeQuery, refetchOnWindowFocus, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, refetch };
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const { onSuccess, onError, onSettled } = options;
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    if (!mountedRef.current) {
      throw new Error('Component unmounted');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(variables);
      
      if (mountedRef.current) {
        setData(response.data);
        onSuccess?.(response.data, variables);
        onSettled?.(response.data, null, variables);
      }
      
      return response.data;
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err);
        onError?.(err, variables);
        onSettled?.(null, err, variables);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [mutationFn, onSuccess, onError, onSettled]);

  const mutate = useCallback(async (variables: TVariables): Promise<TData | undefined> => {
    try {
      return await mutateAsync(variables);
    } catch {
      // Errors are handled in mutateAsync
      return undefined;
    }
  }, [mutateAsync]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return { mutate, mutateAsync, data, loading, error, reset };
}

// Specific hooks for each endpoint
export function useAuth() {
  const { auth } = useJurono();
  return {
    useLogin: (options?: UseMutationOptions) => 
      useMutation((data: any) => auth.login(data), options),
    useRegister: (options?: UseMutationOptions) => 
      useMutation((data: any) => auth.register(data), options),
    useMe: (options?: UseQueryOptions) => 
      useQuery(() => auth.me(), options),
    useLogout: (options?: UseMutationOptions) => 
      useMutation((data: any) => auth.logout(data), options),
  };
}

export function useUsers() {
  const { users } = useJurono();
  return {
    useUsersList: (options?: UseQueryOptions) => 
      useQuery(() => users.list(), options),
    useUser: (id: string, options?: UseQueryOptions) => 
      useQuery(() => users.getById(id), { ...options, enabled: !!id && (options?.enabled ?? true) }),
    useUpdateUser: (options?: UseMutationOptions) => 
      useMutation(({ id, data }: { id: string; data: any }) => users.update(id, data), options),
    useDeleteUser: (options?: UseMutationOptions) => 
      useMutation((id: string) => users.delete(id), options),
  };
}

export function useOrganizations() {
  const { organizations } = useJurono();
  return {
    useOrganizationsList: (params?: Record<string, any>, options?: UseQueryOptions) => 
      useQuery(() => organizations.list(params), options),
    useOrganization: (id: string, options?: UseQueryOptions) => 
      useQuery(() => organizations.getById(id), { ...options, enabled: !!id && (options?.enabled ?? true) }),
    useCreateOrganization: (options?: UseMutationOptions) => 
      useMutation((data: any) => organizations.create(data), options),
    useUpdateOrganization: (options?: UseMutationOptions) => 
      useMutation(({ id, data }: { id: string; data: any }) => organizations.update(id, data), options),
  };
}

export function useClients() {
  const { clients } = useJurono();
  return {
    useClientsList: (params?: Record<string, any>, options?: UseQueryOptions) => 
      useQuery(() => clients.list(params), options),
    useClient: (id: string, options?: UseQueryOptions) => 
      useQuery(() => clients.getById(id), { ...options, enabled: !!id && (options?.enabled ?? true) }),
    useCreateClient: (options?: UseMutationOptions) => 
      useMutation((data: any) => clients.create(data), options),
    useUpdateClient: (options?: UseMutationOptions) => 
      useMutation(({ id, data }: { id: string; data: any }) => clients.update(id, data), options),
  };
}

export function useMandates() {
  const { mandates } = useJurono();
  return {
    useMandatesList: (params?: Record<string, any>, options?: UseQueryOptions) => 
      useQuery(() => mandates.list(params), options),
    useMandate: (id: string, options?: UseQueryOptions) => 
      useQuery(() => mandates.getById(id), { ...options, enabled: !!id && (options?.enabled ?? true) }),
    useAcceptMandate: (options?: UseMutationOptions) => 
      useMutation((id: string) => mandates.accept(id), options),
    useDeclineMandate: (options?: UseMutationOptions) => 
      useMutation((id: string) => mandates.decline(id), options),
    useSignMandate: (options?: UseMutationOptions) => 
      useMutation((id: string) => mandates.sign(id), options),
  };
}

export function useDocuments() {
  const { documents } = useJurono();
  return {
    useDocumentsList: (options?: UseQueryOptions) => 
      useQuery(() => documents.list(), options),
    useDocument: (id: string, options?: UseQueryOptions) => 
      useQuery(() => documents.getById(id), { ...options, enabled: !!id && (options?.enabled ?? true) }),
    useUploadDocument: (options?: UseMutationOptions) => 
      useMutation((data: any) => documents.upload(data), options),
    useDeleteDocument: (options?: UseMutationOptions) => 
      useMutation((id: string) => documents.delete(id), options),
  };
}