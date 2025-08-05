import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Shared state - single source of truth
const sharedIsActive = ref(false)
const sharedSearchQuery = ref('')

// Prevent multiple instances from interfering
let isInitialized = false

export function useSearch() {
  const router = useRouter()
  const route = useRoute()
  
  // Cleanup timers
  let syncTimeout: ReturnType<typeof setTimeout> | null = null

  const isSearchPage = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.location.pathname.startsWith('/search')
  }

  const clearSyncTimeout = () => {
    if (syncTimeout) {
      clearTimeout(syncTimeout)
      syncTimeout = null
    }
  }

  // URL synchronization with debouncing
  const syncUrl = () => {
    if (typeof window === 'undefined' || isSearchPage()) return

    clearSyncTimeout()
    syncTimeout = setTimeout(() => {
      const url = new URL(window.location.href)
      
      if (sharedIsActive.value) {
        const query = sharedSearchQuery.value.trim()
        if (query) {
          url.searchParams.set('q', query)
        } else {
          url.searchParams.delete('q')
        }
        url.hash = '#search'
      } else {
        url.searchParams.delete('q')
        url.hash = ''
      }
      
      history.replaceState(null, '', url.toString())
    }, 100)
  }

  // Initialize from URL on first load
  const initializeFromUrl = () => {
    if (typeof window === 'undefined' || isInitialized) return
    
    const hash = window.location.hash
    const urlParams = new URLSearchParams(window.location.search)
    const urlQuery = urlParams.get('q')
    
    if (hash === '#search') {
      sharedIsActive.value = true
      if (urlQuery) {
        sharedSearchQuery.value = urlQuery
      }
    }
    
    isInitialized = true
  }

  // Watchers
  watch(sharedIsActive, (newVal) => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = newVal ? 'hidden' : ''
    }
    
    // Only sync URL if we're not on search page
    if (!isSearchPage()) {
      syncUrl()
    }
  })

  watch(sharedSearchQuery, () => {
    if (sharedIsActive.value && !isSearchPage()) {
      syncUrl()
    }
  })

  // Handle hash changes from browser navigation
  const handleHashChange = () => {
    if (isSearchPage()) return
    
    const hash = window.location.hash
    const shouldBeActive = hash === '#search'
    
    if (shouldBeActive !== sharedIsActive.value) {
      sharedIsActive.value = shouldBeActive
      
      if (shouldBeActive) {
        const urlParams = new URLSearchParams(window.location.search)
        const urlQuery = urlParams.get('q')
        if (urlQuery && urlQuery !== sharedSearchQuery.value) {
          sharedSearchQuery.value = urlQuery
        }
      }
    }
  }

  // Handle route changes
  const handleRouteChange = (to: any, from: any) => {
    if (to.path !== from.path) {
      if (to.path.startsWith('/search')) {
        // On search page, sync query from URL
        const query = to.query.q as string
        if (query && query !== sharedSearchQuery.value) {
          sharedSearchQuery.value = query
        }
        // Always close overlay when on search page
        if (sharedIsActive.value) {
          sharedIsActive.value = false
        }
      } else {
        // Not on search page, close overlay if open
        if (sharedIsActive.value) {
          sharedIsActive.value = false
        }
        // Clear query when leaving search page
        if (from.path?.startsWith('/search')) {
          sharedSearchQuery.value = ''
        }
      }
    }
  }

  // Core actions
  const openSearch = () => {
    if (!sharedIsActive.value) {
      sharedIsActive.value = true
    }
  }

  const closeSearch = () => {
    if (sharedIsActive.value) {
      sharedIsActive.value = false
      
      if (!isSearchPage()) {
        sharedSearchQuery.value = ''
      }
    }
  }

  const toggleSearch = () => {
    sharedIsActive.value = !sharedIsActive.value
  }

  const setSearchQuery = (query: string) => {
    sharedSearchQuery.value = query
  }

  const setSearchQuerySilently = (query: string) => {
    sharedSearchQuery.value = query
  }

  const navigateToSearchPage = () => {
    const query = sharedSearchQuery.value.trim()
    if (query) {
      router.push({
        path: '/search/',
        query: { q: query }
      })
      
      // Close overlay after navigation
      nextTick(() => {
        closeSearch()
      })
    }
  }

  const handleButtonClick = () => {
    if (sharedIsActive.value) {
      // If already active and has query, navigate to search page
      const query = sharedSearchQuery.value.trim()
      if (query) {
        navigateToSearchPage()
      } else {
        closeSearch()
      }
    } else {
      openSearch()
    }
  }

  // Global keyboard handler
  const handleGlobalKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && sharedIsActive.value) {
      closeSearch()
    }
    
    // Optional: Ctrl/Cmd + K to open search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k' && !sharedIsActive.value) {
      event.preventDefault()
      openSearch()
    }
  }

  // Initialize and setup listeners
  if (typeof window !== 'undefined') {
    initializeFromUrl()
    
    window.addEventListener('hashchange', handleHashChange)
    document.addEventListener('keydown', handleGlobalKeyDown)
    
    const removeRouterListener = router.afterEach(handleRouteChange)
    
    onBeforeUnmount(() => {
      removeRouterListener()
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('keydown', handleGlobalKeyDown)
      clearSyncTimeout()
      
      // Reset body overflow
      if (typeof window !== 'undefined') {
        document.body.style.overflow = ''
      }
    })
  }

  return {
    isActive: sharedIsActive,
    searchQuery: sharedSearchQuery,
    openSearch,
    closeSearch,
    toggleSearch,
    handleButtonClick,
    setSearchQuery,
    setSearchQuerySilently,
    navigateToSearchPage,
    isSearchPage,
  }
}