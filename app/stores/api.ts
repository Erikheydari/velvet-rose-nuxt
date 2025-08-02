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
            errorTitle?: string;
        } = {}
    ) => {
        const { method = 'get', body, headers = {}, timeout } = options;

        try {
            const timeoutValue = getTimeoutConfig(timeout);

            const response = await $fetch<{ data: TResponse }>(endpoint, {
                method: method as any,
                body: body as any,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                timeout: timeoutValue,
            });

            return {
                data: response.data,
                error: null
            };
        } catch (error) {
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

            console.error('errorMessage', errorMessage);

            return {
                data: null,
                error: errorMessage,
            };
        }
    }

    return {
        apiRequest,
        apiLoading: loading,
    }
})