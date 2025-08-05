<script lang="ts" setup>
import { computed, ref, onBeforeUnmount, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, X } from 'lucide-vue-next'

const props = defineProps<{
  isActive: boolean
  searchQuery: string
  closeSearch: () => void
  setSearchQuery: (query: string) => void
  navigateToSearchPage: () => void
}>()

const router = useRouter()
const route = useRoute()
const inputRef = ref<HTMLInputElement | null>(null)
const searchContainerRef = ref<HTMLElement | null>(null)
const localQuery = ref('')

// Sync local query with prop
watch(() => props.searchQuery, (newValue) => {
  if (localQuery.value !== newValue) {
    localQuery.value = newValue
  }
}, { immediate: true })

// Focus management
watch(() => props.isActive, (isActive) => {
  if (isActive) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
        // Set cursor to end of input
        const length = inputRef.value.value.length
        inputRef.value.setSelectionRange(length, length)
      }
    })
  }
})

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  localQuery.value = value
  props.setSearchQuery(value)
}

const handleSubmit = () => {
  if (localQuery.value.trim()) {
    props.navigateToSearchPage()
  }
}

const handleClose = () => {
  props.closeSearch()
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    searchContainerRef.value && 
    !searchContainerRef.value.contains(event.target as Node) && 
    props.isActive
  ) {
    handleClose()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!props.isActive) return
  
  if (event.key === 'Escape') {
    event.preventDefault()
    handleClose()
  } else if (event.key === 'Enter' && localQuery.value.trim()) {
    event.preventDefault()
    handleSubmit()
  }
}

const stopPropagation = (event: Event) => {
  event.stopPropagation()
}

// Lifecycle
onMounted(() => {
  // Handle route changes
  const removeRouterListener = router.afterEach((to, from) => {
    if (to.path !== from.path && !to.path.startsWith('/search')) {
      if (props.isActive) {
        handleClose()
      }
    }
  })

  // Global event listeners
  document.addEventListener('click', handleClickOutside, { passive: true })
  document.addEventListener('keydown', handleKeyDown)

  onBeforeUnmount(() => {
    removeRouterListener()
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isActive" 
      class="fixed inset-0 bg-background/50 backdrop-blur-sm z-40" 
      @click="handleClose"
    />
  </Transition>

  <!-- Search Panel -->
  <Transition
    enter-active-class="transition-all duration-200"
    enter-from-class="opacity-0 transform translate-y-[-10px]"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition-all duration-200"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-[-10px]"
  >
    <div 
      v-if="isActive" 
      ref="searchContainerRef"
      class="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-b-lg shadow-xl p-4 max-h-[80vh] overflow-hidden"
      @click="stopPropagation" 
      dir="rtl"
    >
      <!-- Search Input -->
      <div class="flex items-center gap-2 mb-4">
        <div class="flex-1 relative">
          <input 
            ref="inputRef" 
            v-model="localQuery"
            @input="handleInput"
            @keydown.enter="handleSubmit"
            @keydown.esc="handleClose"
            placeholder="عبارت مورد نظر خود را وارد کنید..."
            class="w-full h-12 rounded-xl bg-muted/50 px-4 body-2 border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            type="text"
            autocomplete="off"
            spellcheck="false"
          />
          
          <!-- Clear button -->
          <button
            v-if="localQuery"
            @click="localQuery = ''; setSearchQuery('')"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            type="button"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        
        <!-- Search button -->
        <TheButton 
          variant="default" 
          size="icon-lg" 
          class="h-12 w-12 shrink-0" 
          @click="handleSubmit"
          :disabled="!localQuery.trim()"
        >
          <Search class="text-primary-foreground w-5 h-5" />
        </TheButton>
        
        <!-- Close button -->
        <TheButton 
          variant="ghost" 
          size="icon-lg" 
          class="h-12 w-12 shrink-0" 
          @click="handleClose"
        >
          <X class="w-5 h-5" />
        </TheButton>
      </div>

      <!-- Search Results -->
      <div class="overflow-y-auto max-h-[calc(80vh-8rem)]">
        <SearchContent :query="localQuery" />
      </div>
    </div>
  </Transition>
</template>