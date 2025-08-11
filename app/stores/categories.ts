import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import type { Category, Product } from '~/types/product.types'
import { useApiStore } from './api'

export const useCategoriesStore = defineStore('categoriesStore', () => {
  const endpointStore = useEndpointStore()
  const apiStore = useApiStore()

  const categories = ref<Category[]>([])
  const category = ref<Category | null>(null)
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

  const fetchCategoryBySlug = async (slug: string) => {
    isLoading.value = true
    const { data, error } = await apiStore.apiRequest(endpointStore.categories.getBySlug(slug), {
      method: 'get',
    });
    if (data) {
      category.value = data as Category
    }
    isLoading.value = false
  }

  const fetchCategoryById = async (id: number) => {
    isLoading.value = true
    const { data, error } = await apiStore.apiRequest(endpointStore.categories.getById(id), {
      method: 'get',
    });
    if (data) {
      category.value = data as Category
    }
    isLoading.value = false
  }

  const getCategoryName = (slug: string) => {
    return categories.value.find(category => category.slug === slug)?.name
  }

  const getCategoryBySlug = (slug: string) => {
    return categories.value.find(category => category.slug === slug)
  }


  return {
    //state
    isLoading,
    error,
    categories,
    category,

    //actions
    fetchCategories,
    fetchCategoryBySlug,
    fetchCategoryById,
    
    //getters
    getCategoryBySlug,
    getCategoryName,
  }
})
