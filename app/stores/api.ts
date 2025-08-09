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
        body?: TRequest | string;
        headers?: Record<string, string>;
        timeout?: number;
        signal?: AbortSignal; // Add signal support
        errorTitle?: string;
      } = {}
    ) => {
      const { method = 'get', body, headers = {}, timeout, signal } = options;
  
      try {
        const timeoutValue = getTimeoutConfig(timeout);
        
        const fetchOptions: any = {
          method: method as any,
          body: body as any,
          headers: {
            ...headers
          },
          timeout: timeoutValue,
        };
  
        // If body is object and no Content-Type provided, default to JSON
        if (body && typeof body === 'object' && !('Content-Type' in fetchOptions.headers)) {
          fetchOptions.headers['Content-Type'] = 'application/json';
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
  
        if (error && typeof error === 'object') {
          if ('statusCode' in error) {
            statusCode = (error as any).statusCode;
          } else if ('status' in error) {
            statusCode = (error as any).status;
          }
  
          if ('data' in error) {
            const errorData = (error as any).data;
            if (errorData && typeof errorData === 'object' && 'message' in errorData) {
              errorMessage = errorData.message;
            }
          }
        }
  
        console.error('API Request Error:', errorMessage);
        return {
          data: null,
          error: errorMessage,
          statusCode
        } as any;
      }
    };
  
    return {
      apiRequest,
      apiLoading: loading,
    };
  });