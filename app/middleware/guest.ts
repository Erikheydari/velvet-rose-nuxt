export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuthStore()
  
  // If user is authenticated, redirect to home page
  if (isLoggedIn) {
    return navigateTo('/')
  }
}) 