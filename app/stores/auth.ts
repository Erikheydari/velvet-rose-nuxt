import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApiStore } from './api'
import { useEndpointStore } from './endpoints'
import type { User, LoginResponse } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
    const apiStore = useApiStore()
    const endpoints = useEndpointStore()

    // State
    const user = ref<User | null>(null)
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    const isAuthenticated = ref<boolean>(false)
    const isInitialized = ref<boolean>(false)
    const token = ref<string | null>(null)

    // Registration and OTP state
    const pendingEmail = ref<string>('')
    const awaitingOtp = ref<boolean>(false)

    // Getters
    const currentUser = computed(() => user.value)
    const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)
    const authToken = computed(() => token.value)
    const hasAuthSnapshot = computed(() => !!token.value && !!user.value)

    // Cookie helpers
    const setTokenCookie = (tokenValue: string) => {
        if (import.meta.client) {
            document.cookie = `auth_token=${tokenValue}; path=/; max-age=2592000; SameSite=Strict`
        }
    }

    const clearTokenCookie = () => {
        if (import.meta.client) {
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
    }

    const getTokenFromCookie = (): string | null => {
        if (import.meta.client) {
            const cookies = document.cookie.split(';')
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=')
                if (name === 'auth_token' && value) {
                    return value
                }
            }
        }
        return null
    }

    // Local snapshot (no network)
    const SNAP_USER_KEY = 'auth:user'
    const saveUserSnapshot = (u: User) => {
        if (!import.meta.client) return
        try {
            localStorage.setItem(SNAP_USER_KEY, JSON.stringify(u))
        } catch {}
    }
    const loadUserSnapshot = (): User | null => {
        if (!import.meta.client) return null
        try {
            const raw = localStorage.getItem(SNAP_USER_KEY)
            return raw ? (JSON.parse(raw) as User) : null
        } catch {
            return null
        }
    }
    const clearUserSnapshot = () => {
        if (!import.meta.client) return
        try {
            localStorage.removeItem(SNAP_USER_KEY)
        } catch {}
    }

    // Actions
    const checkAuthStatus = async () => {
        try {
            loading.value = true
            error.value = null

            let resolvedUser: User | null = null

            // Try primary profile endpoint
            const first = await apiStore.apiRequest<undefined, User | { user: User }>(endpoints.auth.profile, {
                method: 'get',
            })

            if (!first.error && first.data) {
                resolvedUser = ((first.data as any)?.user ?? first.data) as User
            } else {
                // Fallback to alternative endpoint
                const second = await apiStore.apiRequest<undefined, User | { user: User }>(endpoints.auth.me, {
                    method: 'get',
                })
                if (!second.error && second.data) {
                    resolvedUser = ((second.data as any)?.user ?? second.data) as User
                }
            }

            if (resolvedUser) {
                user.value = resolvedUser
                isAuthenticated.value = true
                saveUserSnapshot(resolvedUser)

                const { useCartStore } = await import('./cart')
                const cartStore = useCartStore()
                await cartStore.fetchCart()
            } else {
                user.value = null
                isAuthenticated.value = false
                clearUserSnapshot()
            }
        } catch (err: any) {
            user.value = null
            isAuthenticated.value = false
            clearUserSnapshot()
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

            const form = new FormData()
            form.append('name', payload.name)
            form.append('email', payload.email)
            form.append('password', payload.password)
            form.append('password_confirmation', payload.password)

            const { data, error: apiError } = await apiStore.apiRequest(endpoints.auth.register, {
                method: 'post',
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

            const body = new URLSearchParams()
            body.append('email', username)
            body.append('password', password)

            const { data, error: apiError } = await apiStore.apiRequest<LoginResponse, LoginResponse>(endpoints.auth.login, {
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

            if (data && data.token && data.user) {
                // Store token and user snapshot immediately
                token.value = data.token
                setTokenCookie(data.token)

                user.value = data.user
                isAuthenticated.value = true
                saveUserSnapshot(data.user)

                // Sync cart after successful login
                const { useCartStore } = await import('./cart')
                const cartStore = useCartStore()
                await cartStore.fetchCart()

                // Redirect to saved return URL if any
                const { consumeReturnUrl } = useAuthRedirect()
                const returnTo = consumeReturnUrl()
                if (returnTo && returnTo !== '/auth' && !returnTo.startsWith('/auth/')) {
                    await navigateTo(returnTo)
                } else {
                    await navigateTo('/')
                }
                return true
            } else {
                error.value = 'پاسخ نامعتبر از سرور'
                return false
            }

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

            // Clear user state and token
            user.value = null
            isAuthenticated.value = false
            token.value = null
            clearTokenCookie()
            clearUserSnapshot()

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
            const savedToken = getTokenFromCookie()
            const snap = loadUserSnapshot()
            if (savedToken) {
                token.value = savedToken
            }
            // If we have both, trust snapshot for fast UX without network
            if (savedToken && snap) {
                user.value = snap
                isAuthenticated.value = true
                isInitialized.value = true
                // Optionally refresh in background without blocking
                setTimeout(() => {
                    checkAuthStatus()
                }, 0)
                return
            }
            // Otherwise, fallback to network check if token exists
            if (savedToken) {
                await checkAuthStatus()
                return
            }
            isInitialized.value = true
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
        token: readonly(token),

        // Getters
        currentUser,
        isLoggedIn,
        authToken,
        hasAuthSnapshot,

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