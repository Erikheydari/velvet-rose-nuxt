export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuthStore()
  
  // If user is not authenticated, redirect to login page
  if (!isLoggedIn) {
    return navigateTo('/auth/login')
  }
}) 