export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const { getReturnUrl, setReturnUrl } = useAuthRedirect()
  const { token } = storeToRefs(auth)

  // If a token exists but user is not yet validated, validate now
  const hasToken = !!token.value

  // If user is authenticated, redirect back where they came from or saved URL
  if (hasToken) {
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