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

  // Pagination state
  const pagination = ref<{ meta: any | null; links: any | null }>({ meta: null, links: null })

  // Track current filter context for pagination
  const currentFilter = ref<{ type: 'all' | 'category'; value?: string | null }>({ type: 'all', value: null })

  const fetchProducts = async (page: number = 1) => {
    loading.value = true
    const url = `${endpointStore.products.get}?page=${page}`
    const { data, raw } = await apiStore.apiRequest(url, {
      method: 'get',
    });
    if (data) {
      products.value = data as Product[]
    }
    if (raw && typeof raw === 'object') {
      // Capture pagination info if present
      const maybeMeta: any = (raw as any).meta
      const maybeLinks: any = (raw as any).links
      pagination.value = {
        meta: maybeMeta ?? null,
        links: maybeLinks ?? null,
      }
    }
    currentFilter.value = { type: 'all', value: null }
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

  const fetchProductsByCategory = async (categorySlug: string, page: number = 1) => {
    loading.value = true
    const url = `${endpointStore.products.getByCategory(categorySlug)}&page=${page}`
    const { data, raw } = await apiStore.apiRequest(url, {
      method: 'get',
    });
    if (data) {
      products.value = data as Product[]
    }
    if (raw && typeof raw === 'object') {
      const maybeMeta: any = (raw as any).meta
      const maybeLinks: any = (raw as any).links
      pagination.value = {
        meta: maybeMeta ?? null,
        links: maybeLinks ?? null,
      }
    }
    currentFilter.value = { type: 'category', value: categorySlug }
    loading.value = false
  }

  const goToPage = async (page: number) => {
    const filter = currentFilter.value
    if (filter.type === 'category' && filter.value) {
      await fetchProductsByCategory(filter.value, page)
      return
    }
    await fetchProducts(page)
  }

  return {
    loading,

    products,
    product,
    pagination,
    currentFilter,

    fetchProducts,
    fetchProduct,
    fetchProductsByCategory,
    goToPage,
  }
})
