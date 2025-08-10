import { storeToRefs } from 'pinia'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const { setReturnUrl } = useAuthRedirect()
  const { token } = storeToRefs(auth)

  // If user is not authenticated, redirect to login page
  if (!token.value) {
    // Save target path to return to after login
    const target = to.fullPath || '/'
    setReturnUrl(target)
    return navigateTo('/auth/login')
  }
}) 