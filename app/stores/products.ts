import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import type { Product } from '~/types/product.types'
import { useApiStore } from './api'

export const useProductsStore = defineStore('productsStore', () => {
  const endpointStore = useEndpointStore()
  const apiStore = useApiStore()

  const isLoading = ref(true)
  const products = ref<Product[]>([])
  const product = ref<Product | null>(null)

  const fetchProducts = async () => {
    isLoading.value = true
    const { data, error } = await apiStore.apiRequest(endpointStore.products.get, {
      method: 'get',
    });
    if (data) {
      products.value = data as Product[]
    }
    isLoading.value = false
  }

  const fetchProduct = async (identifier: string | number) => {
    isLoading.value = true
    product.value = null
    try {
      const { data } = await apiStore.apiRequest(endpointStore.products.detail(identifier), {
        method: 'get',
      });
      if (data) {
        product.value = data as Product
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchProductsByCategory = async (categorySlug: string) => {
    isLoading.value = true
    const { data, error } = await apiStore.apiRequest(endpointStore.products.getByCategory(categorySlug), {
      method: 'get',
    });
    if (data) {
      products.value = data as Product[]
    }
    isLoading.value = false
  }

  return {
    isLoading,

    products,
    product,

    fetchProducts,
    fetchProduct,
    fetchProductsByCategory,
  }
})
