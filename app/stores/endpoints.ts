export const useEndpointStore = defineStore('endpointStore', () => {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const apiPrefix = config.public.apiPrefix;

    const products = {
        get: `${apiUrl}${apiPrefix}/products`,
        detail: (id: number) => `${apiUrl}${apiPrefix}/products/${id}`,
    }

    const pages = {
        about: `${apiUrl}${apiPrefix}/pages/about-us`,
        contact: `${apiUrl}${apiPrefix}/pages/contact-us`,
    }

    const brands = {
        get: `${apiUrl}${apiPrefix}/brands`,
    }

    const categories = {
        get: `${apiUrl}${apiPrefix}/categories`,
        products: (id: number) => `${apiUrl}${apiPrefix}/categories/${id}/products`,
        getBySlug: (slug: string) => `${apiUrl}${apiPrefix}/categories/${slug}`,
    }

    return {
        apiUrl,
        apiPrefix,
        products,
        pages,
        brands,
        categories,
    }
})