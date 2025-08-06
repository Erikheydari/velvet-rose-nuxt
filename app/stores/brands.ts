import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import type { Brand, Category } from '~/types/product.types'
import { useApiStore } from './api'

export const useBrandsStore = defineStore('brandsStore', () => {
    const endpointStore = useEndpointStore()
    const apiStore = useApiStore()

    const brands = ref<Brand[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const fetchBrands = async () => {
        try {
            isLoading.value = true
            const { data, error } = await apiStore.apiRequest(endpointStore.brands.get, {
                method: 'get',
            });
            if (data) {
                brands.value = data as Brand[]
            }
        } catch (err) {
            error.value = err as string
        } finally {
            isLoading.value = false
        }
    }

    const getBrandBySlug = (slug: string) => {
        return brands.value.find(brand => brand.slug === slug)
    }


    return {
        //state
        isLoading,
        error,
        brands,

        //actions
        fetchBrands,

        //getters
        getBrandBySlug,
    }
})
