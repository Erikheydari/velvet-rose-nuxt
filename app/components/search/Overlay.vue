<script lang="ts" setup>
import { computed, ref, onBeforeUnmount, watch, nextTick, onMounted, Teleport } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, X } from 'lucide-vue-next'
import { Backdrop } from '@/components/ui/backdrop'
import { Input } from '@/components/ui/input';

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

// Focus management - Fixed to handle both native input and component input
watch(() => props.isActive, (isActive) => {
  if (isActive) {
    nextTick(() => {
      // Try to focus the input element
      const inputElement = inputRef.value as HTMLInputElement

      if (inputElement) {
        // If it's a component wrapper, find the actual input
        const actualInput = inputElement.tagName === 'INPUT'
          ? inputElement
          : inputElement.querySelector('input')

        if (actualInput && typeof actualInput.focus === 'function') {
          actualInput.focus()
          // Set cursor to end of input
          const length = actualInput.value?.length || 0
          if (typeof actualInput.setSelectionRange === 'function') {
            actualInput.setSelectionRange(length, length)
          }
        }
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

const clearSearch = () => {
  localQuery.value = ''
  props.setSearchQuery('')
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
  <Backdrop :is-active="isActive" :handle-close="handleClose" />

  <!-- Search Panel -->
  <Teleport to="body">
    <Transition enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-full md:translate-y-[-10px]"
      enter-to-class="opacity-100 transform translate-y-0" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-full md:translate-y-[-10px]">
      <div v-if="isActive" ref="searchContainerRef" class="
        fixed
        inset-x-0 bottom-0 md:top-24 md:bottom-auto md:left-0 md:right-0 
        z-50
        bg-background 
        rounded-t-2xl
        p-4 md:px-8
        h-[80vh] md:h-auto md:max-h-[80vh] 
        overflow-hidden
      " @click="stopPropagation" dir="rtl">

        <!-- Mobile Handle Bar -->
        <div class="md:hidden flex justify-center h-8 -mb-2" @touchmove.prevent="handleClose">
          <div class="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
        </div>

        <!-- Search Input -->
        <div class="flex items-center gap-2 mb-4">
          <div class="flex-1 relative">
            <Input ref="inputRef" v-model="localQuery" @input="handleInput" @keydown.enter="handleSubmit"
              @keydown.esc="handleClose" placeholder="عبارت مورد نظر خود را وارد کنید..."
              class="w-full h-12 px-4 body-2 text-base md:text-sm" type="text" autocomplete="off" spellcheck="false" />

            <!-- Clear button -->
            <button v-if="localQuery" @click="clearSearch"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
              type="button" aria-label="پاک کردن جستجو">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Search button -->
          <TheButton variant="default" size="icon-lg" class="h-12 w-12 shrink-0 touch-manipulation"
            @click="handleSubmit" :disabled="!localQuery.trim()" aria-label="جستجو">
            <Search class="text-primary-foreground w-5 h-5" />
          </TheButton>

          <!-- Close button -->
          <TheButton variant="ghost" size="icon-lg" class="md:block hidden h-12 w-12 shrink-0 touch-manipulation" @click="handleClose"
            aria-label="بستن">
            <X class="w-5 h-5" />
          </TheButton>
        </div>

        <!-- Search Results -->
        <div class="overflow-y-auto flex-1 md:max-h-[calc(80vh-8rem)] overscroll-contain">
          <SearchContent :query="localQuery" />
        </div>
      </div>
    </Transition>
  </Teleport>

</template>