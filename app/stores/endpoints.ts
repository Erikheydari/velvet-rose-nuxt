import { defineStore } from 'pinia';

export const useEndpointStore = defineStore('endpointStore', () => {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl;
    const apiPrefix = config.public.apiPrefix;

    const products = {
        get: `${apiUrl}${apiPrefix}/products`,
        getByCategory: (categorySlug: string) => `${apiUrl}${apiPrefix}/products?category_slug=${categorySlug}`,
        detail: (identifier: string | number) => `${apiUrl}${apiPrefix}/products/${identifier}`,
        search: (query: string) => `${apiUrl}${apiPrefix}/products?search=${query}`,
    }

    const pages = {
        about: `${apiUrl}${apiPrefix}/pages/about-us`,
        contact: `${apiUrl}${apiPrefix}/pages/contact-us`,
    }

    const contact = {
        send: `${apiUrl}${apiPrefix}/contact`,
    }

    const brands = {
        get: `${apiUrl}${apiPrefix}/brands`,
        getProductsBySlug: (slug: string) => `${apiUrl}${apiPrefix}/brands/${slug}/products`,
    }

    const categories = {
        get: `${apiUrl}${apiPrefix}/categories`,
        getBySlug: (slug: string) => `${apiUrl}${apiPrefix}/categories/${slug}/products`,
        getById: (id: number) => `${apiUrl}${apiPrefix}/categories/${id}/products`,
    }

    const cart = {
        get: `${apiUrl}${apiPrefix}/cart`,
        add: `${apiUrl}${apiPrefix}/cart`,
        update: (itemId: number) => `${apiUrl}${apiPrefix}/cart/${itemId}`,
        remove: (itemId: number) => `${apiUrl}${apiPrefix}/cart/${itemId}`,
    }

    // Auth endpoints according to swagger sample
    const auth = {
        login: `${apiUrl}${apiPrefix}/login`,
        register: `${apiUrl}${apiPrefix}/register`,
        verifyOtp: `${apiUrl}${apiPrefix}/verify-otp`,
        forgotPassword: `${apiUrl}${apiPrefix}/forgot-password`,
        resetPassword: `${apiUrl}${apiPrefix}/reset-password`,
        logout: `${apiUrl}${apiPrefix}/logout`,
        profile: `${apiUrl}${apiPrefix}/profile`,
    }

    // Profile endpoints
    const profile = {
        editPassword: `${apiUrl}${apiPrefix}/profile/edit-password`,
    }

    // Locations endpoints (from postorder.json)
    const locations = {
        provinces: `${apiUrl}${apiPrefix}/provinces`,
        citiesByProvince: (provinceId: number) => `${apiUrl}${apiPrefix}/provinces/${provinceId}/cities`,
    }

    // Orders endpoints (from postorder.json)
    const orders = {
        create: `${apiUrl}${apiPrefix}/orders`,
        get: `${apiUrl}${apiPrefix}/orders`,
        detail: (id: number | string) => `${apiUrl}${apiPrefix}/orders/${id}`,
    }

    const payments = {
        initiate: `${apiUrl}${apiPrefix}/payment/initiate`,
        verify: (authority: string) => `${apiUrl}${apiPrefix}/payment/verify?Authority=${authority}`,
    }

    return {
        apiUrl,
        apiPrefix,
        products,
        pages,
        brands,
        categories,
        cart,
        auth,
        profile,
        locations,
        orders,
        payments,
        contact,
    }
})