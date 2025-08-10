export const useAuthRedirect = () => {
  const STORAGE_KEY = 'auth:return_to'

  const setReturnUrl = (path: string) => {
    if (import.meta.client && path) {
      sessionStorage.setItem(STORAGE_KEY, path)
    }
  }

  const getReturnUrl = (): string | null => {
    if (!import.meta.client) return null
    return sessionStorage.getItem(STORAGE_KEY)
  }

  const consumeReturnUrl = (): string | null => {
    if (!import.meta.client) return null
    const value = sessionStorage.getItem(STORAGE_KEY)
    if (value) sessionStorage.removeItem(STORAGE_KEY)
    return value
  }

  return { setReturnUrl, getReturnUrl, consumeReturnUrl }
} 