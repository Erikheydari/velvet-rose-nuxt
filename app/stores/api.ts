import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useErrorHandler } from '@/composables/useErrorHandler';

export const useApiStore = defineStore('apiStore', () => {
  const config = useRuntimeConfig();
  const loading = ref(false);

  // Configuration
  const requestTimeout = ref(+(config.public.requestTimeout as string || '5000'));

  // Use error handler composable
  const { processError } = useErrorHandler();

  // Helper function to get timeout configuration
  const getTimeoutConfig = (customTimeout?: number) => {
    const timeout = customTimeout ?? requestTimeout.value;
    return timeout === -1 ? undefined : timeout;
  };

  // Generic API request function
  const apiRequest = async <TRequest, TResponse>(
    endpoint: string,
    options: {
      method?: 'get' | 'post' | 'put' | 'delete';
      body?: TRequest | string | FormData | URLSearchParams;
      headers?: Record<string, string>;
      timeout?: number;
      signal?: AbortSignal;
      errorTitle?: string;
      credentials?: boolean;
      showErrorToast?: boolean;
      customErrorHandler?: (error: any) => boolean;
    } = {}
  ) => {
    const { 
      method = 'get', 
      body, 
      headers = {}, 
      timeout, 
      signal, 
      credentials = false, 
      showErrorToast = true,
      customErrorHandler
    } = options;

    try {
      const timeoutValue = getTimeoutConfig(timeout);

      const fetchOptions: any = {
        method: method.toUpperCase(),
        headers: {
          Accept: 'application/json',
          ...headers
        },
        timeout: timeoutValue,
      };

      // Handle credentials
      if (credentials) {
        fetchOptions.credentials = 'include';
      }

      // Add authorization header
      try {
        const authStore = useAuthStore();
        const token = authStore.authToken;
        if (token && !fetchOptions.headers['Authorization']) {
          fetchOptions.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.warn('Failed to add auth token:', e);
      }

      // Handle request body
      if (body !== undefined && body !== null) {
        if (body instanceof FormData) {
          fetchOptions.body = body;
        } else if (body instanceof URLSearchParams) {
          if (!fetchOptions.headers['Content-Type']) {
            fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          }
          fetchOptions.body = body.toString();
        } else if (typeof body === 'string') {
          fetchOptions.body = body;
        } else if (typeof body === 'object') {
          if (!fetchOptions.headers['Content-Type']) {
            fetchOptions.headers['Content-Type'] = 'application/json';
          }
          fetchOptions.body = JSON.stringify(body);
        }
      }

      // Add signal
      if (signal) {
        fetchOptions.signal = signal;
      }

      const response = await $fetch<{ data: TResponse } | TResponse>(endpoint, fetchOptions);

      // Handle response format
      const data = response && typeof response === 'object' && 'data' in response
        ? (response as { data: TResponse }).data
        : response as TResponse;

      return {
        data,
        raw: response,
        error: null
      };
    } catch (error: any) {
      // Handle abort errors
      if (error && typeof error === 'object' && error.name === 'AbortError') {
        return {
          data: null,
          error: 'Request was aborted',
          aborted: true
        };
      }

      // Process error using error handler composable
      const errorResult = processError(error, { 
        showErrorToast, 
        customErrorHandler 
      });

      return {
        data: null,
        ...errorResult
      };
    }
  };

  return {
    apiRequest,
    apiLoading: loading,
  };
});