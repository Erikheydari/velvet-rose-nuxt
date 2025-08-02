import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import type { Product } from '~/types/product.types'
import { useApiStore } from './api'

export const useProductsStore = defineStore('productsStore', () => {
  const endpointStore = useEndpointStore()
  const apiStore = useApiStore()

  const products = ref<Product[]>([])

  const fetchProducts = async () => {
    const { data, error } = await apiStore.apiRequest(endpointStore.products.get, {
      method: 'get',
    });
    if (data) {
      products.value = data as Product[]
    }
  }


  return {
    products,

    fetchProducts,
  }
})
