export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Initialize auth state on app startup
  try {
    await authStore.initAuth()
  } catch (error) {
    const { getErrorMessage } = await import('~/lib/utils')
    console.error('Auth initialization failed:', getErrorMessage(error))
  }
}) 