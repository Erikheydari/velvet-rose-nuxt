import { defineStore } from 'pinia'
import { useApiStore } from './api'
import { useEndpointStore } from './endpoints'

export type Province = { id: number; name: string }
export type City = { id: number; name: string; province_id?: number }

export type CreateOrderPayload = {
  address: string
  full_name: string
  phone_number: string
  city_id: number
  description?: string | null
}

export const useOrdersStore = defineStore('ordersStore', () => {
  const apiStore = useApiStore()
  const endpoints = useEndpointStore()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const provinces = ref<Province[]>([])
  const cities = ref<City[]>([])

  const selectedProvinceId = ref<number | null>(null)
  const selectedCityId = ref<number | null>(null)

  const fetchProvinces = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: apiError } = await apiStore.apiRequest<undefined, Province[]>(endpoints.locations.provinces, {
        method: 'get',
        credentials: true,
      })
      if (apiError) {
        error.value = apiError
        provinces.value = []
        return
      }
      provinces.value = Array.isArray(data) ? data : ((data as any)?.data ?? [])
    } finally {
      loading.value = false
    }
  }

  const fetchCitiesByProvince = async (provinceId: number) => {
    selectedProvinceId.value = provinceId
    selectedCityId.value = null
    loading.value = true
    error.value = null
    try {
      const { data, error: apiError } = await apiStore.apiRequest<undefined, City[]>(endpoints.locations.citiesByProvince(provinceId), {
        method: 'get',
        credentials: true,
      })
      if (apiError) {
        error.value = apiError
        cities.value = []
        return
      }
      cities.value = Array.isArray(data) ? data : ((data as any)?.data ?? [])
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (payload: CreateOrderPayload) => {
    loading.value = true
    error.value = null
    try {
      const form = new FormData()
      form.append('address', payload.address)
      form.append('full_name', payload.full_name)
      form.append('phone_number', payload.phone_number)
      form.append('city_id', String(payload.city_id))
      if (payload.description) form.append('description', payload.description)

      const { data, raw, error: apiError } = await apiStore.apiRequest<FormData, any>(endpoints.orders.create, {
        method: 'post',
        body: form,
        credentials: true,
        showErrorToast: false, // Component will handle error display
      })
      if (apiError) {
        error.value = apiError
        return { error: apiError }
      }
      const paymentUrl = (raw as any)?.payment_url?.url || (data as any)?.payment_url?.url
      const authority = (raw as any)?.payment_url?.authority || (data as any)?.payment_url?.authority
      return { data: (data as any) ?? null, paymentUrl, authority }
    } catch (e: any) {
      error.value = e?.message || 'سفارش ثبت نشد'
      return { error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    loading,
    error,
    provinces,
    cities,
    selectedProvinceId,
    selectedCityId,

    // actions
    fetchProvinces,
    fetchCitiesByProvince,
    createOrder,
  }
}) 