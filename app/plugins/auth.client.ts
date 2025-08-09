export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state on app startup
  try {
    await authStore.initAuth()
  } catch (error) {
    console.error('Auth initialization failed:', error)
  }
}) 