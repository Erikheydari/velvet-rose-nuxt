import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import type { Product } from '~/types/product.types'
import { useApiStore } from './api'
import type { ProductByBrand } from '~/types/brand.types'

export const useBrandsStore = defineStore('brandsStore', () => {
    const endpointStore = useEndpointStore()
    const apiStore = useApiStore()

    const brands = ref<ProductByBrand[]>([])
    const isLoading = ref(true)
    const error = ref<string | null>(null)

    // Store products for each brand using a Map for efficient lookup
    const brandProductsMap = ref<Map<string, Product[]>>(new Map())
    const brandProducts = ref<Product[]>([])
    const brand = ref<ProductByBrand | null>(null)
    const isLoadingBrands = ref<Set<string>>(new Set())

    const fetchBrands = async () => {
        try {
            isLoading.value = true
            const { data, error } = await apiStore.apiRequest(endpointStore.brands.get, {
                method: 'get',
            });
            if (data) {
                brands.value = data as ProductByBrand[]
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

    const fetchBrandProductsBySlug = async (slug: string) => {
        try {
            isLoading.value = true
            error.value = null
            // Don't immediately clear state to prevent race conditions

            const { data, error: apiError } = await apiStore.apiRequest(endpointStore.brands.getProductsBySlug(slug), {
                method: 'get',
            });

            if (apiError) {
                error.value = apiError
                brandProducts.value = []
                brand.value = null
                return []
            }

            if (data) {
                const apiData = data as { products?: Product[]; brand?: ProductByBrand }
                const products = Array.isArray(apiData.products) ? apiData.products : []
                const brandData = apiData as ProductByBrand || null

                brandProductsMap.value.set(slug, products)
                brandProducts.value = products
                brand.value = brandData as ProductByBrand
                return products
            }

            // Only clear if no data returned
            brandProducts.value = []
            brand.value = null
            return []
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : 'خطا در بارگذاری محصولات برند'
            error.value = errorMessage
            console.error('Error fetching brand products:', err)
            // Only clear state on error
            brandProducts.value = []
            brand.value = null
            return []
        } finally {
            isLoading.value = false
        }
    }

    const fetchAllBrandProducts = async () => {
        if (brands.value.length === 0) return

        // Fetch products for all brands concurrently
        const promises = brands.value
            .filter(brand => brand.slug)
            .map(brand => fetchBrandProductsBySlug(brand.slug!))

        await Promise.all(promises)
    }

    const getBrandProducts = (slug: string) => {
        return brandProductsMap.value.get(slug) || []
    }

    const clearCurrentBrand = () => {
        brandProducts.value = []
        brand.value = null
        error.value = null
    }

    return {
        //state
        isLoading,
        error,
        brands,
        brandProducts,
        brandProductsMap,
        isLoadingBrands,
        brand,

        //actions
        fetchBrands,
        fetchBrandProductsBySlug,
        fetchAllBrandProducts,
        clearCurrentBrand,

        //getters
        getBrandBySlug,
        getBrandProducts,
    }
})
