import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import { useApiStore } from './api'
import { useEndpointStore } from './endpoints'

export interface User {
    id: string
    email: string
    name?: string
    phone?: string
}

export const useAuthStore = defineStore('auth', () => {
    const apiStore = useApiStore()
    const endpoints = useEndpointStore()

    // State
    const user = ref<User | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const isAuthenticated = ref<boolean>(false)
    const isInitialized = ref<boolean>(false)

    // Registration and OTP state
    const pendingEmail = ref<string>('')
    const awaitingOtp = ref<boolean>(false)

    // Getters
    const currentUser = computed(() => user.value)
    const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)

    // Actions
    const checkAuthStatus = async () => {
        try {
            loading.value = true
            error.value = null

            const { data, error: apiError } = await apiStore.apiRequest<undefined, User>(endpoints.auth.profile, {
                method: 'get',
            })

            if (!apiError && data) {
                user.value = data
                isAuthenticated.value = true

                // Sync cart when authentication is verified
                const { useCartStore } = await import('./cart')
                const cartStore = useCartStore()
                await cartStore.fetchCart()
            } else {
                user.value = null
                isAuthenticated.value = false
            }
        } catch (err: any) {
            user.value = null
            isAuthenticated.value = false
        } finally {
            loading.value = false
            isInitialized.value = true
        }
    }

    const register = async (payload: { name: string; email: string; password: string }) => {
        try {
            loading.value = true
            error.value = null
            awaitingOtp.value = false
            pendingEmail.value = ''

            // According to note: backend expects password_confirmation, we can send same as password.
            const form = new FormData()
            form.append('name', payload.name)
            form.append('email', payload.email)
            form.append('password', payload.password)
            form.append('password_confirmation', payload.password)

            const { data, error: apiError } = await apiStore.apiRequest(endpoints.auth.register, {
                method: 'post',
                // Let browser set multipart/form-data boundary
                body: form as any,
            })

            if (apiError) {
                error.value = apiError
                return false
            }

            pendingEmail.value = payload.email
            awaitingOtp.value = true
            return true
        } catch (err: any) {
            error.value = err?.message || 'ثبت نام ناموفق بود.'
            return false
        } finally {
            loading.value = false
        }
    }

    const verifyOtp = async (otp: string) => {
        try {
            loading.value = true
            error.value = null

            // Swagger says x-www-form-urlencoded
            const body = new URLSearchParams()
            body.append('email', pendingEmail.value)
            body.append('otp', otp)

            const { error: apiError } = await apiStore.apiRequest(endpoints.auth.verifyOtp, {
                method: 'post',
                body: body.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            if (apiError) {
                error.value = apiError
                return false
            }

            // After verification, user is authenticated; fetch profile
            await checkAuthStatus()

            awaitingOtp.value = false
            pendingEmail.value = ''

            await navigateTo('/')
            return true
        } catch (err: any) {
            error.value = err?.message || 'تایید کد ناموفق بود.'
            return false
        } finally {
            loading.value = false
        }
    }

    const passwordLogin = async (username: string, password: string) => {
        try {
            loading.value = true
            error.value = null

            // Swagger shows multipart/form-data for login
            const form = new FormData()
            form.append('email', username)
            form.append('password', password)

            const { error: apiError } = await apiStore.apiRequest(endpoints.auth.login, {
                method: 'post',
                body: form as any,
            })

            if (apiError) {
                error.value = apiError
                return false
            }

            // After successful login, get user data
            await checkAuthStatus()

            // Sync cart after successful login
            const { useCartStore } = await import('./cart')
            const cartStore = useCartStore()
            await cartStore.fetchCart()

            await navigateTo('/')
            return true

        } catch (err: any) {
            error.value = err?.message || 'ورود ناموفق بود. لطفا دوباره تلاش کنید.'
            return false
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        try {
            loading.value = true
            error.value = null

            await apiStore.apiRequest(endpoints.auth.logout, {
                method: 'post',
            })

            // Clear user state
            user.value = null
            isAuthenticated.value = false

            // Handle cart state change after logout
            const { useCartStore } = await import('./cart')
            const cartStore = useCartStore()
            await cartStore.clearCart()

            await navigateTo('/')
        } catch (err: any) {
            error.value = err?.message || 'خروج ناموفق بود'
        } finally {
            loading.value = false
        }
    }

    const clearError = () => {
        error.value = null
    }

    // Initialize auth state when store is created
    const initAuth = async () => {
        if (import.meta.client) {
            await checkAuthStatus()
        }
    }

    return {
        // State
        user: readonly(user),
        loading: readonly(loading),
        error: readonly(error),
        isAuthenticated: readonly(isAuthenticated),
        isInitialized: readonly(isInitialized),
        awaitingOtp: readonly(awaitingOtp),
        pendingEmail: readonly(pendingEmail),

        // Getters
        currentUser,
        isLoggedIn,

        // Actions
        checkAuthStatus,
        passwordLogin,
        register,
        verifyOtp,
        logout,
        clearError,
        initAuth
    }
})