import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useEndpointStore } from '@/stores/endpoints';
import { useAuthStore } from '@/stores/auth';

export const useApiStore = defineStore('apiStore', () => {
    const config = useRuntimeConfig();
    const endpointStore = useEndpointStore();
    const loading = ref(false);
  
    // Configuration
    const requestTimeout = ref(+(config.public.requestTimeout as string || '5000'));
  
    // Helper function to get timeout configuration
    const getTimeoutConfig = (customTimeout?: number) => {
      const timeout = customTimeout ?? requestTimeout.value;
      return timeout === -1 ? undefined : timeout;
    };
  
    // Generic API request function using useFetch
    const apiRequest = async <TRequest, TResponse>(
      endpoint: string,
      options: {
        method?: 'get' | 'post' | 'put' | 'delete';
        body?: TRequest | string | FormData | URLSearchParams;
        headers?: Record<string, string>;
        timeout?: number;
        signal?: AbortSignal;
        errorTitle?: string;
        credentials?: boolean; // Add credentials option
      } = {}
    ) => {
      const { method = 'get', body, headers = {}, timeout, signal, credentials = false } = options;
  
      try {
        const timeoutValue = getTimeoutConfig(timeout);
        
        const fetchOptions: any = {
          method: method as any,
          headers: {
            Accept: 'application/json',
            ...headers
          },
          timeout: timeoutValue,
        };

        // Only add credentials when explicitly requested
        if (credentials) {
          fetchOptions.credentials = 'include';
        }

        // Attach Authorization header if token exists and not already provided
        try {
          const authStore = useAuthStore()
          const maybeRefToken: any = (authStore as any).authToken
          const tokenValue = maybeRefToken && typeof maybeRefToken === 'object' && 'value' in maybeRefToken
            ? maybeRefToken.value
            : maybeRefToken
          if (tokenValue && !fetchOptions.headers['Authorization']) {
            fetchOptions.headers['Authorization'] = `Bearer ${tokenValue}`
          }
        } catch {}
  
        // Prepare body and Content-Type safely based on payload type
        if (body !== undefined && body !== null) {
          const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
          const isURLSearchParams = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;
  
          if (isFormData) {
            // Let the browser set multipart/form-data with proper boundary
            fetchOptions.body = body as FormData;
          } else if (isURLSearchParams) {
            // Send as x-www-form-urlencoded
            if (!('Content-Type' in fetchOptions.headers)) {
              fetchOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            fetchOptions.body = (body as URLSearchParams).toString();
          } else if (typeof body === 'string') {
            // Caller is responsible for Content-Type
            fetchOptions.body = body;
          } else if (typeof body === 'object') {
            // JSON payload
            if (!('Content-Type' in fetchOptions.headers)) {
              fetchOptions.headers['Content-Type'] = 'application/json';
            }
            fetchOptions.body = JSON.stringify(body);
          }
        }
  
        // Add signal if provided
        if (signal) {
          fetchOptions.signal = signal;
        }
  
        const response = await $fetch<{ data: TResponse } | TResponse>(endpoint, fetchOptions);
  
        // Support both wrapped and raw responses
        const data = (response && typeof response === 'object' && 'data' in (response as any))
          ? (response as any).data as TResponse
          : response as TResponse
      
        return {
          data,
          raw: response as any,
          error: null
        };
      } catch (error) {
        // Handle AbortError specifically
        if (error && typeof error === 'object' && 'name' in error && (error as any).name === 'AbortError') {
          return {
            data: null,
            error: 'Request was aborted',
            aborted: true
          } as any;
        }
      
        let errorMessage = 'Request failed';
        let statusCode = null as number | null;
        let errorData: any = null;
      
        if (error && typeof error === 'object') {
          if ('statusCode' in error) {
            statusCode = (error as any).statusCode;
          } else if ('status' in error) {
            statusCode = (error as any).status;
          }

          if ('data' in error) {
            errorData = (error as any).data;
            if (errorData && typeof errorData === 'object' && 'message' in errorData) {
              errorMessage = (errorData as any).message;
            }
          }
        }
      
        console.error('API Request Error:', errorMessage);
        return {
          data: null,
          error: errorMessage,
          statusCode,
          errorData
        } as any;
      }
    };
  
    return {
      apiRequest,
      apiLoading: loading,
    };
  });