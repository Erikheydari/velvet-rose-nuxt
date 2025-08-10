import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const { getReturnUrl, setReturnUrl } = useAuthRedirect()
  const { token, isAuthenticated } = storeToRefs(auth)

  const hasToken = !!token.value

  // If user already has a token, optionally trigger validation and redirect away from guest pages
  if (hasToken) {
    if (!isAuthenticated.value) {
      // Validate in background; we do not block the redirect
      auth.checkAuthStatus()
    }

    const previous = from?.fullPath && from.fullPath !== to.fullPath ? from.fullPath : null
    const saved = getReturnUrl()
    const target = previous || saved || '/'

    if (import.meta.client) {
      const { toast } = await import('vue-sonner')
      toast.info('شما در حال حاضر وارد شدید!')
    }

    return navigateTo(target, { replace: true })
  }

  // Guest: remember where they came from for post-login return
  const cameFrom = from?.fullPath
  if (cameFrom && cameFrom !== to.fullPath && !cameFrom.startsWith('/auth')) {
    setReturnUrl(cameFrom)
  }
}) 