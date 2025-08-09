export const useEndpointStore = defineStore('endpointStore', () => {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const apiPrefix = config.public.apiPrefix;

    const products = {
        get: `${apiUrl}${apiPrefix}/products`,
        detail: (identifier: string | number) => `${apiUrl}${apiPrefix}/products/${identifier}`,
        search: (query: string) => `${apiUrl}${apiPrefix}/products?search=${query}`,
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

    const cart = {
        get: `${apiUrl}${apiPrefix}/cart`,
        add: `${apiUrl}${apiPrefix}/cart`,
        update: (itemId: number) => `${apiUrl}${apiPrefix}/cart/${itemId}`,
        remove: (itemId: number) => `${apiUrl}${apiPrefix}/cart/${itemId}`,
    }

    return {
        apiUrl,
        apiPrefix,
        products,
        pages,
        brands,
        categories,
        cart,
    }
})