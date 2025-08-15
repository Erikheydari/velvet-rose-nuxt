import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const { getReturnUrl, setReturnUrl } = useAuthRedirect()
  const { token, isAuthenticated, isInitialized } = storeToRefs(auth)

  // Wait for auth initialization on client side
  if (import.meta.client && !isInitialized.value) {
    await auth.initAuth()
  }

  const hasToken = !!token.value

  // If user already has a token, redirect away from guest pages
  if (hasToken && isAuthenticated.value) {
    const previous = from?.fullPath && from.fullPath !== to.fullPath ? from.fullPath : null
    const saved = getReturnUrl()
    const target = previous || saved || '/'

    if (import.meta.client) {
      const { toast } = await import('vue-sonner')
      toast.info('شما در حال حاضر وارد شدید!')
    }

    return navigateTo(target, { replace: true })
  }

  // If token exists but not authenticated, validate first
  if (hasToken && !isAuthenticated.value) {
    const isValid = await auth.checkAuthStatus()
    if (isValid) {
      // Now authenticated, redirect
      const previous = from?.fullPath && from.fullPath !== to.fullPath ? from.fullPath : null
      const saved = getReturnUrl()
      const target = previous || saved || '/'

      if (import.meta.client) {
        const { toast } = await import('vue-sonner')
        toast.info('شما در حال حاضر وارد شدید!')
      }

      return navigateTo(target, { replace: true })
    }
  }

  // Guest: remember where they came from for post-login return
  const cameFrom = from?.fullPath
  if (cameFrom && cameFrom !== to.fullPath && !cameFrom.startsWith('/auth')) {
    setReturnUrl(cameFrom)
  }
}) 