import { defineStore } from 'pinia'
import { useApiStore } from './api'
import { useEndpointStore } from './endpoints'

export const usePaymentsStore = defineStore('paymentsStore', () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const apiStore = useApiStore()
  const endpoints = useEndpointStore()
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

  const verifyPayment = async (authority: string) => {
    if (!authority) return
    
    console.log('Calling payment verification API:', endpoints.payments.verify(authority))
    
    const { data, error: apiError, raw } = await apiStore.apiRequest<undefined, any>(endpoints.payments.verify(authority), {
      method: 'get',
      credentials: true,
    })
    
    console.log('API Response:', { data, error: apiError, raw })
    
    if (apiError) {
      error.value = apiError
      console.error('Payment verification error:', apiError)
    }
    
    if (data) {
      console.log('Payment verification success:', data)
      return data
    }
    
    console.log('No data returned from payment verification')
    return null
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
    clearPayment,
    verifyPayment,
  }
}) 