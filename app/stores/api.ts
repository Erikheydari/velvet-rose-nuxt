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
        body?: TRequest;
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
            'Content-Type': 'application/json',
            ...headers
          },
          timeout: timeoutValue,
        };
  
        // Add signal if provided
        if (signal) {
          fetchOptions.signal = signal;
        }
  
        const response = await $fetch<{ data: TResponse }>(endpoint, fetchOptions);
  
        return {
          data: response.data,
          error: null
        };
      } catch (error) {
        // Handle AbortError specifically
        if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
          return {
            data: null,
            error: 'Request was aborted',
            aborted: true
          };
        }
  
        let errorMessage = 'Request failed';
        let statusCode = null;
  
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
        };
      }
    };
  
    return {
      apiRequest,
      apiLoading: loading,
    };
  });