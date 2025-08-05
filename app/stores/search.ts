import { defineStore } from 'pinia'
import { useEndpointStore } from './endpoints'
import { useApiStore } from './api'
import type { Product } from '~/types/product.types'
import { useSearch } from '~/composables/useSearch'
import { ref, computed, watch } from 'vue'

export const useSearchStore = defineStore('searchStore', () => {
  const endpointStore = useEndpointStore()
  const apiStore = useApiStore()
  const { searchQuery: globalSearchQuery } = useSearch()

  // Real-time search state
  const searchResults = ref<Product[]>([])
  const isSearching = ref<boolean>(false)
  const searchError = ref<Error | null>(null)
  const localSearchQuery = ref<string>('')
  const debouncedSearchQuery = ref<string>('')

  // Full search state (for search page)
  const fullSearchResults = ref<Product[]>([])
  const isFullSearching = ref<boolean>(false)
  const fullSearchError = ref<Error | null>(null)
  const fullSearchQuery = ref<string>('')
  const fullSearchMeta = ref<any>(null) // For pagination, total count, etc.

  // Search history (optional enhancement)
  const searchHistory = ref<string[]>([])
  const maxHistoryItems = 10

  // Debounce timer and abort controller
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let abortController: AbortController | null = null

  // Computed properties
  const hasResults = computed(() => searchResults.value.length > 0)
  const hasSearched = computed(() => debouncedSearchQuery.value.trim() !== '')
  const hasFullResults = computed(() => fullSearchResults.value.length > 0)
  const isLoading = computed(() => isSearching.value || isFullSearching.value)

  // Utility functions
  const clearDebounceTimer = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  const abortPreviousRequest = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  // Add to search history
  const addToHistory = (query: string) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery || searchHistory.value.includes(trimmedQuery)) return

    searchHistory.value.unshift(trimmedQuery)
    if (searchHistory.value.length > maxHistoryItems) {
      searchHistory.value = searchHistory.value.slice(0, maxHistoryItems)
    }

    // Persist to localStorage if available
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
      } catch (error) {
        console.warn('Failed to save search history:', error)
      }
    }
  }

  // Load search history from localStorage
  const loadSearchHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('search-history')
        if (saved) {
          searchHistory.value = JSON.parse(saved)
        }
      } catch (error) {
        console.warn('Failed to load search history:', error)
      }
    }
  }

  // Clear search history
  const clearSearchHistory = () => {
    searchHistory.value = []
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('search-history')
      } catch (error) {
        console.warn('Failed to clear search history:', error)
      }
    }
  }

  // Debounced search method
  const setSearchQuery = (query: string) => {
    localSearchQuery.value = query

    // Update global search query for URL synchronization
    if (globalSearchQuery.value !== query) {
      globalSearchQuery.value = query
    }

    // Clear previous timer and abort previous request
    clearDebounceTimer()
    abortPreviousRequest()

    const trimmedQuery = query.trim()

    // If query is empty, clear results immediately
    if (!trimmedQuery) {
      debouncedSearchQuery.value = ''
      searchResults.value = []
      searchError.value = null
      return
    }

    // Set new timer for non-empty queries
    debounceTimer = setTimeout(() => {
      debouncedSearchQuery.value = trimmedQuery
      performSearch()
    }, 300) // 300ms debounce
  }

  // Perform the actual real-time search
  const performSearch = async () => {
    const query = debouncedSearchQuery.value.trim()
    if (!query) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    searchError.value = null
    
    // Create abort controller for this request
    abortController = new AbortController()

    try {
      const { data, error } = await apiStore.apiRequest(
        endpointStore.products.search(query),
        { 
          method: 'get',
          signal: abortController.signal
        }
      )

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return
      }

      if (error) {
        console.error('Search API error:', error)
        searchError.value = new Error(error)
        searchResults.value = []
      } else {
        // Handle different response formats
        const products = data?.products || data || []
        searchResults.value = Array.isArray(products) ? products : []
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      console.error('Search request failed:', err)
      searchError.value = err as Error
      searchResults.value = []
    } finally {
      isSearching.value = false
      abortController = null
    }
  }

  // Perform full search (for search page)
  const performFullSearch = async (query: string, options: { page?: number, limit?: number } = {}) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      fullSearchResults.value = []
      fullSearchMeta.value = null
      return
    }

    // Add to search history
    addToHistory(trimmedQuery)

    fullSearchQuery.value = trimmedQuery
    isFullSearching.value = true
    fullSearchError.value = null

    // Create abort controller for this request
    abortPreviousRequest()
    abortController = new AbortController()

    try {
      const searchParams = new URLSearchParams({
        q: trimmedQuery,
        page: String(options.page || 1),
        limit: String(options.limit || 20)
      })

      const { data, error } = await apiStore.apiRequest(
        `${endpointStore.products.search(trimmedQuery)}?${searchParams.toString()}`,
        { 
          method: 'get',
          signal: abortController.signal
        }
      )

      // Check if request was aborted
      if (abortController.signal.aborted) {
        return
      }

      if (error) {
        console.error('Full search API error:', error)
        fullSearchError.value = new Error(error)
        fullSearchResults.value = []
        fullSearchMeta.value = null
      } else {
        // Handle different response formats
        if (data?.products) {
          fullSearchResults.value = Array.isArray(data.products) ? data.products : []
          fullSearchMeta.value = data.meta || data.pagination || null
        } else if (Array.isArray(data)) {
          fullSearchResults.value = data
          fullSearchMeta.value = null
        } else {
          fullSearchResults.value = []
          fullSearchMeta.value = null
        }
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      console.error('Full search request failed:', err)
      fullSearchError.value = err as Error
      fullSearchResults.value = []
      fullSearchMeta.value = null
    } finally {
      isFullSearching.value = false
      abortController = null
    }
  }

  // Clear search results and query
  const clearSearch = () => {
    clearDebounceTimer()
    abortPreviousRequest()
    
    localSearchQuery.value = ''
    debouncedSearchQuery.value = ''
    searchResults.value = []
    searchError.value = null

    if (globalSearchQuery.value !== '') {
      globalSearchQuery.value = ''
    }
  }

    // Clear full search results
    const clearFullSearch = () => {
      abortPreviousRequest()
      
      fullSearchQuery.value = ''
      fullSearchResults.value = []
      fullSearchError.value = null
      fullSearchMeta.value = null
    }
  


  // Sync with global search query from composable
  watch(globalSearchQuery, (newQuery) => {
    if (localSearchQuery.value !== newQuery) {
      setSearchQuery(newQuery)
    }
  }, { immediate: true })

  // Cleanup on store destruction
  const cleanup = () => {
    clearDebounceTimer()
  }

  return {
    // Real-time search state
    searchResults,
    isSearching,
    searchError,
    searchQuery: localSearchQuery, // expose as searchQuery for compatibility
    debouncedSearchQuery,

    // Full search state
    fullSearchResults,
    isFullSearching,
    fullSearchError,
    fullSearchQuery,

    // Computed
    hasResults,
    hasSearched,
    hasFullResults,

    // Actions
    setSearchQuery,
    performSearch,
    clearSearch,
    performFullSearch,
    clearFullSearch,
    cleanup
  }
})