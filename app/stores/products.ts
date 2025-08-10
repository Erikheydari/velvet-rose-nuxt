import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import type { Product } from '~/types/product.types'
import { useApiStore } from './api'

export const useProductsStore = defineStore('productsStore', () => {
  const endpointStore = useEndpointStore()
  const apiStore = useApiStore()

  const loading = ref(true)
  const products = ref<Product[]>([])
  const product = ref<Product | null>(null)

  const fetchProducts = async () => {
    loading.value = true
    const { data, error } = await apiStore.apiRequest(endpointStore.products.get, {
      method: 'get',
    });
    if (data) {
      products.value = data as Product[]
    }
    loading.value = false
  }

  const fetchProduct = async (identifier: string | number) => {
    loading.value = true
    product.value = null
    try {
      const { data } = await apiStore.apiRequest(endpointStore.products.detail(identifier), {
        method: 'get',
      });
      if (data) {
        product.value = data as Product
      }
    } finally {
      loading.value = false
    }
  }

  const fetchProductsByCategory = async (categorySlug: string) => {
    loading.value = true
    const { data, error } = await apiStore.apiRequest(endpointStore.products.getByCategory(categorySlug), {
      method: 'get',
    });
    if (data) {
      products.value = data as Product[]
    }
    loading.value = false
  }

  return {
    loading,

    products,
    product,

    fetchProducts,
    fetchProduct,
    fetchProductsByCategory,
  }
})
