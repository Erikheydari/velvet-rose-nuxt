<script lang="ts" setup>
import { useSearchStore } from '~/stores/search'
import { computed, watch, onMounted } from 'vue'
import { useSearch } from '~/composables/useSearch'
import { useRouter } from 'vue-router'

interface SearchProduct {
  name: string
  slug: string
  price: string
  sale_price: string | null
  thumbnail: string | null
  [key: string]: any
}

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
const searchResults = computed(() => searchStore.searchResults as unknown as SearchProduct[])
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

const handleProductClick = (product: SearchProduct): void => {
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
      <TheButton 
        variant="link"
        @click="navigateToFullSearch"
        class="caption-1"
      >
        مشاهده همه نتایج
      </TheButton>
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

    <div v-else-if="hasResults" class="py-2 overflow-y-auto max-h-[60vh]">
      <ul class="space-y-2">
        <li v-for="(product, index) in searchResults" :key="index">
          {{ product }}
        </li>
      </ul>
      
      <div class="mt-4 text-center">
        <TheButton 
          variant="ghost"
          @click="navigateToFullSearch"
          class="px-4 py-2 text-sm"
        >
          مشاهده همه نتایج جستجو
        </TheButton>
      </div>
    </div>

    <div v-else class="py-4">
      <p class="text-center text-muted-foreground caption-1">لطفا عبارت مورد نظر خود را برای جستجو وارد کنید</p>
    </div>
  </div>
</template>