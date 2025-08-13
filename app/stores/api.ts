import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';

export const useApiStore = defineStore('apiStore', () => {
  const config = useRuntimeConfig();
  const loading = ref(false);

  // Configuration
  const requestTimeout = ref(+(config.public.requestTimeout as string || '5000'));

  // Error deduplication system
  const recentErrors = ref(new Set<string>());
  const errorCleanupTimer = ref<NodeJS.Timeout | null>(null);
  const ERROR_CLEANUP_DELAY = 5000; // Clear error history after 5 seconds of no errors

  // Helper function to get timeout configuration
  const getTimeoutConfig = (customTimeout?: number) => {
    const timeout = customTimeout ?? requestTimeout.value;
    return timeout === -1 ? undefined : timeout;
  };

  // Smart error deduplication - only shows unique errors, resets after quiet period
  const shouldShowError = (errorMessage: string): boolean => {
    // Always show if we haven't seen this error recently
    if (!recentErrors.value.has(errorMessage)) {
      recentErrors.value.add(errorMessage);

      // Clear existing timer
      if (errorCleanupTimer.value) {
        clearTimeout(errorCleanupTimer.value);
      }

      // Set new cleanup timer - clears error history after quiet period
      errorCleanupTimer.value = setTimeout(() => {
        recentErrors.value.clear();
        errorCleanupTimer.value = null;
      }, ERROR_CLEANUP_DELAY);

      return true;
    }

    // Don't show duplicate errors
    return false;
  };

  // Helper function to determine if this is a network/connectivity error
  const isNetworkError = (error: any, statusCode: number | null, errorMessage: string): boolean => {
    // Check for network-related errors
    if (error && typeof error === 'object') {
      // Check for CORS errors
      if ('name' in error && (error.name === 'TypeError' || error.name === 'NetworkError')) {
        return true;
      }

      // Check for fetch-related network errors
      if ('message' in error) {
        const message = error.message.toLowerCase();
        if (message.includes('network') ||
          message.includes('cors') ||
          message.includes('fetch') ||
          message.includes('connection') ||
          message.includes('timeout') ||
          message.includes('refused')) {
          return true;
        }
      }
    }

    // Check for common network status codes
    if (statusCode === null || statusCode === 0) {
      return true; // No status code usually means network issue
    }

    // Check for generic or network-related error messages
    const message = errorMessage.toLowerCase();
    if (message === 'request failed' ||
      message === 'unknown api error' ||
      message.includes('network') ||
      message.includes('cors') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('fetch')) {
      return true;
    }

    // Check for server connectivity issues (5xx errors without specific messages)
    if (statusCode && statusCode >= 500 && statusCode < 600) {
      // Only treat as network error if we don't have a specific error message from server
      return !errorMessage || errorMessage === 'Request failed';
    }

    // If we have a specific status code and meaningful error message, it's likely a valid API error
    return false;
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
      showErrorToast?: boolean; // Option to control automatic error toast display
    } = {}
  ) => {
    const { method = 'get', body, headers = {}, timeout, signal, credentials = false, showErrorToast = true } = options;

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
      } catch { }

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

      console.log('Raw API response:', response)
      console.log('Response type:', typeof response)
      console.log('Response constructor:', response?.constructor?.name)

      // Support both wrapped and raw responses
      const data = (response && typeof response === 'object' && 'data' in (response as any))
        ? (response as any).data as TResponse
        : response as TResponse

      console.log('Processed data:', data)

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

      // Show error toast only for unique errors (deduplication)
      // Create a normalized error key for similar errors
      const errorKey = errorMessage || 'Unknown API Error';
      const normalizedErrorKey = `${statusCode || 'unknown'}: ${errorKey}`;

      if (showErrorToast && shouldShowError(normalizedErrorKey)) {
        // Determine what error message to show
        const shouldShowNetworkError = isNetworkError(error, statusCode, errorMessage);

        if (shouldShowNetworkError) {
          // Show generic network error for network issues, CORS, or unknown errors
          toast.error('لطفا اینترنت خود را بررسی کنید، در صورت خطا با پشتیبانی تماس بگیرید');
        } else {
          // Show the specific error message from the server
          toast.error(errorMessage);
        }
      }
      return {
        data: null,
        error: errorMessage,
        statusCode,
        errorData
      } as any;
    }
  };

  // Cleanup function to prevent memory leaks
  const cleanup = () => {
    if (errorCleanupTimer.value) {
      clearTimeout(errorCleanupTimer.value);
      errorCleanupTimer.value = null;
    }
    recentErrors.value.clear();
  };

  return {
    apiRequest,
    apiLoading: loading,
    cleanup,
  };
});