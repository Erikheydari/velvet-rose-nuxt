import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const { setReturnUrl } = useAuthRedirect()
  const { token, isAuthenticated, loading, isInitialized } = storeToRefs(auth)


  const authToken = auth.getTokenFromCookie()
  // Wait for auth initialization on client side
  if (import.meta.client && !isInitialized.value) {
    await auth.initAuth()
  }

    // No token → redirect to login and remember where to return
    if (!authToken) {
      const target = to.fullPath || '/'
      setReturnUrl(target)
      return navigateTo('/auth/login')
    }




  // Token exists but user not authenticated yet → validate
  if (authToken && !isAuthenticated.value && !loading.value) {
    const isValid = await auth.checkAuthStatus()
    if (!isValid) {
      // Token was invalid, redirect to login
      const target = to.fullPath || '/'
      setReturnUrl(target)
      return navigateTo('/auth/login')
    }
  }

  // At this point, we have a valid token and authenticated user
  // Page can proceed
}) 