import { defineStore } from 'pinia'
import { useApiStore } from './api'
import { useEndpointStore } from './endpoints'
import { toast } from 'vue-sonner'

export type ChangePasswordPayload = {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export const useProfileStore = defineStore('profileStore', () => {
  const apiStore = useApiStore()
  const endpoints = useEndpointStore()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const changePassword = async (payload: ChangePasswordPayload) => {
    loading.value = true
    error.value = null
    
    try {
      const form = new FormData()
      form.append('current_password', payload.current_password)
      form.append('new_password', payload.new_password)
      form.append('new_password_confirmation', payload.new_password_confirmation)

      const { data, error: apiError } = await apiStore.apiRequest<FormData, any>(
        endpoints.profile.editPassword,
        {
          method: 'post',
          body: form,
          credentials: true,
          showErrorToast: false, // We'll handle the toast manually
        }
      )

      if (apiError) {
        error.value = apiError
        toast.error(apiError)
        return { success: false, error: apiError }
      }

      toast.success('رمز عبور با موفقیت تغییر کرد')
      return { success: true, data }
    } catch (e: any) {
      const errorMessage = e?.message || 'خطا در تغییر رمز عبور'
      error.value = errorMessage
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    loading,
    error,
    
    // actions
    changePassword,
  }
})
