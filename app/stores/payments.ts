import { defineStore } from 'pinia'

export const usePaymentsStore = defineStore('paymentsStore', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const paymentAuthority = ref<string | null>(null)
  const paymentUrl = ref<string | null>(null)

  const initiatePayment = async () => {
    if (!paymentUrl.value) return
    window.location.href = paymentUrl.value
    clearPayment()
    /*     const { data, error: apiError } = await apiStore.apiRequest<undefined, any>(endpoints.payments.initiate, {
          method: 'post',
          credentials: true,
        })
        if (apiError) {
          error.value = apiError
        }
        if (data) {
          setPaymentUrl(data.payment_url, data.authority)
        } */
  }

  const setPaymentUrl = (url: string, authority: string) => {
    paymentUrl.value = url
    paymentAuthority.value = authority
    if (import.meta.client) {
      sessionStorage.setItem('paymentUrl', url)
      sessionStorage.setItem('authority', authority)
    }
  }

  const clearPayment = () => {
    paymentUrl.value = null
    paymentAuthority.value = null
    if (import.meta.client) {
      sessionStorage.removeItem('paymentUrl')
      sessionStorage.removeItem('authority')
    }
  }

  return {
    // state
    loading,
    error,
    paymentAuthority,
    paymentUrl,

    // actions
    initiatePayment,
    setPaymentUrl,
  }
}) 