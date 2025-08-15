export default defineNuxtPlugin(async () => {
  // Initialize auth store early on client side
  const authStore = useAuthStore()
  
  // Ensure auth is initialized before the app starts
  if (import.meta.client) {
    await authStore.initAuth()
  }
})
