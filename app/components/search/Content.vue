<script lang="ts" setup>
import { useSearchStore } from '~/stores/search'
import { computed, watch, onMounted } from 'vue'
import { useSearch } from '~/composables/useSearch'
import { useRouter } from 'vue-router'
import type { Product } from '~/types/product.types'

const props = defineProps({
  query: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const searchStore = useSearchStore()
const { searchQuery: globalSearchQuery, closeSearch } = useSearch()  // Now shares global state

const isLoading = computed(() => searchStore.isSearching)
const hasResults = computed(() => searchStore.hasResults)
const searchResults = computed(() => searchStore.searchResults as unknown as Product[])
const hasSearched = computed(() => searchStore.hasSearched)
const error = computed(() => searchStore.searchError)
const displayQuery = computed(() => globalSearchQuery.value || props.query)

onMounted(() => {
  if (props.query && props.query !== globalSearchQuery.value) {
    searchStore.setSearchQuery(props.query)
  }
})

watch(() => props.query, (newQuery) => {
  if (newQuery && newQuery !== globalSearchQuery.value) {
    searchStore.setSearchQuery(newQuery)
  } else if (!newQuery && globalSearchQuery.value && !props.query) {
    searchStore.clearSearch()
  }
})

const handleProductClick = (product: Product): void => {
  navigateTo(`/product/${product.slug}`)
}

const navigateToFullSearch = () => {
  router.push({
    path: '/search/',
    query: { q: displayQuery.value }
  })

  setTimeout(() => {
    closeSearch()
  }, 200)
}
</script>

<template>
  <div class="w-full" dir="rtl">
    <div v-if="hasSearched && hasResults" class="mb-3 flex justify-between items-center">
      <p class="caption-1 text-muted-foreground">جستجو برای: "{{ displayQuery }}"</p>
    </div>

    <div v-if="isLoading" class="py-4">
      <p class="text-center text-muted-foreground caption-1">در حال جستجو...</p>
    </div>

    <div v-else-if="error" class="py-4">
      <p class="text-center text-destructive caption-1">مشکلی در جستجو پیش آمد. لطفاً دوباره امتحان کنید.</p>
    </div>

    <div v-else-if="hasSearched && !hasResults" class="py-4">
      <p class="text-center text-muted-foreground caption-1">نتیجه‌ای برای جستجوی شما یافت نشد.</p>
    </div>

    <div v-else-if="hasResults">
      <div class="lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
        <ProductSearchCard v-for="(product, index) in searchResults.slice(0, 6)" :product="product" :key="index" />
      </div>


      <div class="mt-4 text-center">
        <TheButton variant="tonal" @click="navigateToFullSearch" class="px-4 py-2 text-sm">
          مشاهده همه نتایج جستجو
        </TheButton>
      </div>
    </div>

    <div v-else class="py-4">
      <p class="text-center text-muted-foreground caption-1">لطفا عبارت مورد نظر خود را برای جستجو وارد کنید</p>
    </div>
  </div>
</template>