import { ref } from 'vue';
import { toast } from 'vue-sonner';

export const useErrorHandler = () => {
  // Error deduplication system
  const recentErrors = ref<Set<string>>(new Set());
  const errorCleanupTimer = ref<NodeJS.Timeout | null>(null);
  const ERROR_CLEANUP_DELAY = 5000;

  // Smart error deduplication
  const shouldShowError = (errorKey: string): boolean => {
    if (recentErrors.value.has(errorKey)) {
      return false;
    }

    recentErrors.value.add(errorKey);

    // Clear existing timer
    if (errorCleanupTimer.value) {
      clearTimeout(errorCleanupTimer.value);
    }

    // Set new cleanup timer
    errorCleanupTimer.value = setTimeout(() => {
      recentErrors.value.clear();
      errorCleanupTimer.value = null;
    }, ERROR_CLEANUP_DELAY);

    return true;
  };

  // Categorize error types for better UX
  const getErrorCategory = (error: any, statusCode: number | null): 'network' | 'server' | 'client' | 'unknown' => {
    // Network/Connectivity issues
    if (error?.name === 'TypeError' || error?.name === 'NetworkError') {
      return 'network';
    }

    if (error?.message) {
      const message = error.message.toLowerCase();
      const networkKeywords = ['network', 'cors', 'fetch', 'connection', 'timeout', 'refused', 'failed to fetch'];
      if (networkKeywords.some(keyword => message.includes(keyword))) {
        return 'network';
      }
    }

    // No status code usually means network issue
    if (statusCode === null || statusCode === 0) {
      return 'network';
    }

    // Server errors (5xx)
    if (statusCode >= 500 && statusCode < 600) {
      return 'server';
    }

    // Client errors (4xx)
    if (statusCode >= 400 && statusCode < 500) {
      return 'client';
    }

    return 'unknown';
  };

  // Generate user-friendly error messages
  const getErrorMessage = (error: any, statusCode: number | null, errorCategory: string): string => {
    // Try to get server error message
    if (error?.data?.message) {
      return error.data.message;
    }

    // Handle different error categories
    switch (errorCategory) {
      case 'network':
        return 'مشکل در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.';
      case 'server':
        return 'سرور در دسترس نیست. لطفاً بعداً تلاش کنید.';
      case 'client':
        if (statusCode === 401) {
          return 'عدم احراز هویت. لطفاً دوباره وارد شوید.';
        }
        if (statusCode === 403) {
          return 'دسترسی غیرمجاز.';
        }
        if (statusCode === 404) {
          return 'منبع مورد نظر یافت نشد.';
        }
        return 'خطایی در درخواست رخ داده است.';
      default:
        return 'خطای نامشخص. لطفاً با پشتیبانی تماس بگیرید.';
    }
  };

  // Show error toast with deduplication
  const showErrorToast = (errorMessage: string, statusCode: number | null = null) => {
    const errorKey = `${statusCode || 'unknown'}:${errorMessage}`;

    if (shouldShowError(errorKey)) {
      toast.error(errorMessage);
    }
  };

  // Process error and show appropriate toast
  const processError = (
    error: any,
    options: {
      showErrorToast?: boolean;
      customErrorHandler?: (error: any) => boolean;
    } = {}
  ) => {
    const { showErrorToast: shouldShowToast = true, customErrorHandler } = options;

    // Allow custom error handling
    if (customErrorHandler && customErrorHandler(error)) {
      return {
        error: error?.message || 'Request failed',
        statusCode: error?.statusCode ?? error?.status ?? null,
        errorData: error?.data ?? null
      };
    }

    // Extract error details
    const statusCode = error?.statusCode ?? error?.status ?? null;
    const errorData = error?.data ?? null;

    // Generate error message
    const errorCategory = getErrorCategory(error, statusCode);
    const errorMessage = getErrorMessage(error, statusCode, errorCategory);

    // Show error toast
    if (shouldShowToast) {
      showErrorToast(errorMessage, statusCode);
    }

    return {
      error: errorMessage,
      statusCode,
      errorData
    };
  };

  // Cleanup function
  const cleanup = () => {
    if (errorCleanupTimer.value) {
      clearTimeout(errorCleanupTimer.value);
      errorCleanupTimer.value = null;
    }
    recentErrors.value.clear();
  };

  return {
    processError,
    showErrorToast,
    cleanup
  };
};