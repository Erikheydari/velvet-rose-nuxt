import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { useApiStore } from './api'
import { useEndpointStore } from './endpoints'
import type { User, LoginResponse } from '@/types/auth.types'
import { useCookie } from '#app'
import { toast } from 'vue-sonner'

export const useAuthStore = defineStore('auth', () => {
    const apiStore = useApiStore()
    const endpoints = useEndpointStore()

    // State
    const user = ref<User | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)
    const isAuthenticated = ref<boolean>(false)
    const isInitialized = ref<boolean>(false)
    const token = ref<string | null>(null)
    const needVerify = ref<boolean>(false)
    const isForgotPasswordOtpSent = ref<boolean>(false)
    const forgotPasswordEmail = ref<string | null>(null)

    // Registration and OTP state
    const pendingEmail = ref<string>('')
    const awaitingOtp = ref<boolean>(false)

    // Getters
    const currentUser = computed(() => user.value)
    const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)
    const authToken = computed(() => token.value)
    const hasAuthSnapshot = computed(() => !!token.value && !!user.value)

    // Cookie helpers
    const tokenCookie = useCookie<string | null>('auth_token', {
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'strict',
        path: '/'
    })

    const setTokenCookie = (tokenValue: string) => {
        tokenCookie.value = tokenValue
    }

    const clearTokenCookie = () => {
        tokenCookie.value = null
    }

    const getTokenFromCookie = (): string | null => {
        return tokenCookie.value
    }

    // Local snapshot (no network)
    const SNAP_USER_KEY = 'auth:user'
    const saveUserSnapshot = (u: User) => {
        if (!import.meta.client) return
        try {
            localStorage.setItem(SNAP_USER_KEY, JSON.stringify(u))
        } catch { }
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
        } catch { }
    }

    const clearAuthState = (options: { clearToken?: boolean } = { clearToken: true }) => {
        user.value = null
        isAuthenticated.value = false
        if (options.clearToken) {
            token.value = null
            clearTokenCookie()
        }
        clearUserSnapshot()
    }

    // Actions
    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            loading.value = true
            error.value = null

            // Ensure we have a token before hitting the network
            const savedToken = token.value || getTokenFromCookie()
            if (!savedToken) {
                clearAuthState({ clearToken: false })
                return false
            }

            // Make sure token in memory mirrors cookie
            token.value = savedToken

            let resolvedUser: User | null = null
            let statusCode: number | null = null

            // Try primary profile endpoint
            const first = await apiStore.apiRequest<undefined, User | { user: User }>(endpoints.auth.profile, {
                method: 'get',
                credentials: true,
            }) as any

            statusCode = first?.statusCode ?? null

            if (!first.error && first.data) {
                resolvedUser = ((first.data as any)?.user ?? first.data) as User
            }

            // If unauthorized, nuke token so user can try again
            if ((statusCode === 401 || statusCode === 403) && !resolvedUser) {
                clearAuthState({ clearToken: true })
                return false
            }

            if (resolvedUser) {
                user.value = resolvedUser
                isAuthenticated.value = true
                saveUserSnapshot(resolvedUser)

                const { useCartStore } = await import('./cart')
                const cartStore = useCartStore()
                await cartStore.fetchCart()
                return true
            }

            // No user resolved but not unauthorized → treat as logged out
            clearAuthState({ clearToken: false })
            return false
        } catch (err: any) {
            clearAuthState({ clearToken: false })
            return false
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
                credentials: true, // Add credentials for auth endpoints
                showErrorToast: false, // Component will handle error display via watcher
            })

            if (apiError) {
                error.value = apiError
                return false
            }

            pendingEmail.value = payload.email
            awaitingOtp.value = true
            toast.success(data?.message)
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

            const { data, error: apiError } = await apiStore.apiRequest(endpoints.auth.verifyOtp, {
                method: 'post',
                body: body.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: true, // Add credentials for auth endpoints
                showErrorToast: false, // Component will handle error display via watcher
            })

            if (apiError) {
                error.value = apiError
                return false
            }

            await checkAuthStatus()

            awaitingOtp.value = false
            pendingEmail.value = ''
            needVerify.value = false

            toast.success(data?.message)

            await navigateTo('/auth/login')
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

            const { data, error: apiError, statusCode, errorData } = await apiStore.apiRequest<LoginResponse, LoginResponse>(endpoints.auth.login, {
                method: 'post',
                body: body.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: false,
                showErrorToast: false, // Component will handle error display via watcher
            })

            if (apiError) {
                // Detect unverified email flow from backend
                const needsVerification = !!(errorData && (errorData.need_verification || (errorData as any).need_verify))
                if ((statusCode === 401 || statusCode === 403) && needsVerification) {
                    needVerify.value = true
                    pendingEmail.value = username
                    // Error will be displayed by component watcher
                    return false
                }

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
                needVerify.value = false
                console.log(needVerify.value)
                return true
            } else {
                error.value = 'پاسخ نامعتبر از سرور'
                return false
            }

        } catch (err: any) {
            error.value = err?.message || 'ورود ناموفق بود. لطفا دوباره تلاش کنید.'
            needVerify.value = err.response?.data?.need_verify
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
                credentials: true, // Add credentials for auth endpoints
            })

            // Clear user state and token
            clearAuthState({ clearToken: true })

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

    const requestPasswordReset = async (email: string) => {
        try {
            forgotPasswordEmail.value = email
            loading.value = true
            error.value = null

            const { data, error: apiError } = await apiStore.apiRequest(endpoints.auth.forgotPassword, {
                method: 'post',
                body: { email },
                showErrorToast: false,
            })

            if (apiError) {
                error.value = apiError
                return false
            }

            isForgotPasswordOtpSent.value = true
            toast.success(data?.message)
            return true
        } catch (err: any) {
            error.value = err?.message || 'درخواست بازیابی رمز عبور ناموفق بود'
            forgotPasswordEmail.value = null
            return false
        } finally {
            loading.value = false
        }
    }

    const resetPassword = async (email: string, password: string, otp: string) => {
        try {
            loading.value = true
            error.value = null

            const form = new FormData()
            form.append('email', email)
            form.append('otp_code', otp)
            form.append('password', password)
            form.append('password_confirmation', password)

            const { data, error: apiError } = await apiStore.apiRequest(endpoints.auth.resetPassword, {
                method: 'post',
                body: form,
                showErrorToast: false,
            })

            if (apiError) {
                error.value = apiError
                return false
            }

            // Clear forgot password state on success
            forgotPasswordEmail.value = null
            isForgotPasswordOtpSent.value = false
            
            toast.success(data?.message || 'رمز عبور با موفقیت تغییر کرد')
            return true
        } catch (err: any) {
            error.value = err?.message || 'تغییر رمز عبور ناموفق بود'
            return false
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
        needVerify: readonly(needVerify),
        isForgotPasswordOtpSent: readonly(isForgotPasswordOtpSent),
        forgotPasswordEmail,

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
        initAuth,
        requestPasswordReset,
        resetPassword,
    }
})