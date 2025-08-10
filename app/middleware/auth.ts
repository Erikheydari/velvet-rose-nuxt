import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const { setReturnUrl } = useAuthRedirect()
  const { token } = storeToRefs(auth)

  // No token → redirect to login and remember where to return
  if (!token.value) {
    const target = to.fullPath || '/'
    setReturnUrl(target)
    return navigateTo('/auth/login')
  }

  // Token exists: ensure user is validated in background
  const { currentUser, loading } = storeToRefs(auth)
  if (!currentUser.value && !loading.value) {
    // Fire and forget; page can proceed while we validate
    auth.checkAuthStatus()
  }
}) 