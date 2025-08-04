import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import type { Category, Product } from '~/types/product.types'
import { useApiStore } from './api'

export const useCategoriesStore = defineStore('categoriesStore', () => {
  const endpointStore = useEndpointStore()
  const apiStore = useApiStore()

  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    try {
      isLoading.value = true
      const { data, error } = await apiStore.apiRequest(endpointStore.categories.get, {
        method: 'get',
      });
      if (data) {
        categories.value = data as Category[]
      }
    } catch (err) {
      error.value = err as string
    } finally {
      isLoading.value = false
    }
  }

  const getCategoryBySlug = (slug: string) => {
    return categories.value.find(category => category.slug === slug)
  }


  return {
    //state
    isLoading,
    error,
    categories,

    //actions
    fetchCategories,

    //getters
    getCategoryBySlug,
  }
})
