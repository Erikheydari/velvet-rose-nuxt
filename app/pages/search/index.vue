<template>
    <div class="min-h-screen bg-background default-padding-top">
        <!-- Search Header -->
        <div class="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
            <div class="lg-inner-container default-padding-x py-4">
                <div class="flex items-center gap-4">
                    <TheButton variant="ghost" size="icon" @click="$router.go(-1)" class="shrink-0">
                        <ArrowRight class="size-5" />
                    </TheButton>

                    <div class="flex-1 relative">
                        <Search
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input v-model="searchQuery" placeholder="جستجو در محصولات..." class="w-full pr-10 text-right"
                            @keydown.enter="handleSearch" autofocus />
                    </div>

                    <TheButton variant="default" size="sm" @click="handleSearch"
                        :disabled="!searchQuery.trim() || isLoading" class="shrink-0">
                        <Loader2 v-if="isLoading" class="size-4 animate-spin ml-2" />
                        جستجو
                    </TheButton>
                </div>
            </div>
        </div>

        <!-- Search Results -->
        <div class="lg-inner-container default-padding-x py-6">

            <!-- Search Results Grid -->
            <ProductGrid :loading="isLoading" :title="`نتایج جستجو برای: ${displayQuery}`" :filterable="false">
                <!-- Search Results -->
                <template v-if="hasResults">
                    <ProductCard v-for="product in searchResults" :key="product.id" :product="product" type="default"
                        class="h-full" />
                </template>

                <!-- Suggested Products when no search performed -->
                <template v-else-if="!hasSearched && !isLoading">
                    <ProductCard v-for="product in suggestedProducts" :key="product.id" :product="product"
                        type="default" class="h-full" />
                </template>

                <!-- Empty State -->
                <template #empty>
                    <div class="col-span-full py-16 text-center">
                        <div class="max-w-md mx-auto">
                            <Search class="size-12 text-muted-foreground mx-auto mb-4" />
                            <h3 class="heading-6 text-foreground mb-2">نتیجه‌ای یافت نشد</h3>
                            <p class="text-muted-foreground mb-6">
                                متأسفانه نتیجه‌ای برای جستجوی شما یافت نشد. لطفاً با کلمات کلیدی دیگری امتحان کنید.
                            </p>
                            <div class="space-y-2">
                                <p class="text-sm text-muted-foreground">پیشنهادات:</p>
                                <div class="flex flex-wrap gap-2 justify-center">
                                    <TheButton v-for="suggestion in searchSuggestions" :key="suggestion"
                                        variant="outline" size="sm" @click="searchWithSuggestion(suggestion)"
                                        class="text-xs">
                                        {{ suggestion }}
                                    </TheButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Pagination -->
                <template #pagination>
                    <div v-if="hasResults && pagination && pagination.totalPages > 1" class="flex justify-center">
                    </div>
                </template>
            </ProductGrid>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, ArrowRight, Loader2, Clock } from 'lucide-vue-next'
import { useSearchStore } from '~/stores/search'
import { useProductsStore } from '~/stores/products'
import { Input } from '~/components/ui/input'

// Meta tags
useHead({
    title: 'جستجو در محصولات',
    meta: [
        { name: 'description', content: 'جستجو در محصولات و برندهای موجود' }
    ]
})

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()
const productsStore = useProductsStore()

// Local state
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 20

// Computed properties
const isLoading = computed(() => searchStore.isFullSearching)
const searchResults = computed(() => searchStore.fullSearchResults)
const hasResults = computed(() => searchStore.hasFullResults)
const hasSearched = computed(() => searchStore.fullSearchQuery !== '')
const searchHistory = computed(() => searchStore.searchHistory)
const pagination = computed(() => searchStore.fullSearchMeta)
const displayQuery = computed(() => searchStore.fullSearchQuery || searchQuery.value)

// Suggested products (fallback when no search performed)
const suggestedProducts = computed(() => productsStore.products.slice(0, 12))

// Search suggestions for empty state
const searchSuggestions = ['عطر زنانه', 'عطر مردانه', 'ادکلن', 'پرفیوم', 'عطر تابستانی']

// Handle route query parameter
const initializeFromRoute = () => {
    const query = route.query.q as string
    if (query) {
        searchQuery.value = query
        performSearch(query, 1)
    }
}

// Perform search
const performSearch = async (query?: string, page: number = 1) => {
    const searchTerm = query || searchQuery.value.trim()
    if (!searchTerm) return

    currentPage.value = page

    await searchStore.performFullSearch(searchTerm)

    // Update URL without triggering navigation
    if (searchTerm !== route.query.q) {
        await router.replace({
            path: '/search',
            query: { q: searchTerm, ...(page > 1 && { page: page.toString() }) }
        })
    }
}

// Event handlers
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        performSearch(searchQuery.value, 1)
    }
}

/* const handlePageChange = (page: number) => {
  if (searchStore.fullSearchQuery) {
    performSearch(searchStore.fullSearchQuery, page)
  }
} */

const searchWithSuggestion = (suggestion: string) => {
    searchQuery.value = suggestion
    performSearch(suggestion, 1)
}

const clearHistory = () => {
    searchStore.clearSearchHistory()
}

// Watch for route changes
watch(() => route.query.q, (newQuery) => {
    if (newQuery && newQuery !== searchQuery.value) {
        searchQuery.value = newQuery as string
        performSearch(newQuery as string, 1)
    }
})

// Watch for page parameter changes
watch(() => route.query.page, (newPage) => {
    const page = parseInt(newPage as string) || 1
    if (page !== currentPage.value && searchStore.fullSearchQuery) {
        performSearch(searchStore.fullSearchQuery, page)
    }
})

// Initialize
onMounted(async () => {
    // Load suggested products if no search query
    if (!route.query.q) {
        await productsStore.fetchProducts()
    }

    initializeFromRoute()
})

// Cleanup on unmount
onBeforeUnmount(() => {
    searchStore.clearFullSearch()
})
</script>

<style scoped>
@import '~/assets/css/tailwind.css';
</style>
