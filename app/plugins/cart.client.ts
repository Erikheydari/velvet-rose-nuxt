/* export default defineNuxtPlugin(async () => {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  
  // Initialize auth first
  try {
    await authStore.initAuth()
  } catch (error) {
    console.error('Auth initialization failed:', error)
  }
  
  // Initialize cart for all users (authenticated and unauthenticated)
  try {
    await cartStore.initializeCart()
  } catch (error) {
    console.error('Cart initialization failed:', error)
  }
  
  // Watch for authentication changes
  watch(
    () => authStore.isLoggedIn,
    async (isLoggedIn) => {
      if (isLoggedIn) {
        // User logged in - initialize cart
        try {
          await cartStore.initializeCart()
        } catch (error) {
          console.error('Cart initialization failed after login:', error)
        }
      } else {
        // User logged out - reset cart store
        cartStore.resetStore()
      }
    },
    { immediate: false }
  )
  
  // Watch for auth store initialization
  watch(
    () => authStore.isInitialized,
    async (isInitialized) => {
      if (isInitialized && authStore.isLoggedIn) {
        try {
          await cartStore.initializeCart()
        } catch (error) {
          console.error('Cart initialization failed after auth initialized:', error)
        }
      }
    },
    { immediate: false }
  )
})  */