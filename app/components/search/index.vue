<script lang="ts" setup>
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  searchQuery: string
  handleButtonClick: () => void
}>()

const handleTriggerClick = (event: MouseEvent | KeyboardEvent) => {
  event.preventDefault()
  event.stopPropagation()
  props.handleButtonClick()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    handleTriggerClick(event)
  }
}
</script>

<template>
  <div class="flex items-center rounded-xl overflow-hidden border border-input bg-muted/30 hover:bg-muted/50 transition-colors">
    <!-- Search Input Area -->
    <div 
      class="flex-1 h-12 px-4 py-2 flex items-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
      @click="handleTriggerClick"
      @keydown="handleKeyDown"
      role="button"
      tabindex="0"
      :aria-label="searchQuery ? `جستجو برای: ${searchQuery}` : 'باز کردن جستجو'"
    >
      <span 
        v-if="!searchQuery" 
        class="text-muted-foreground body-3 truncate"
      >
        مدویو، عینک شنا، جمر، مایو اقتصادی و ...
      </span>
      <span 
        v-else 
        class="body-3 text-foreground truncate"
      >
        {{ searchQuery }}
      </span>
    </div>
    
    <!-- Search Button -->
    <TheButton 
      variant="default" 
      size="icon-lg" 
      class="h-12 w-12 rounded-l-none shrink-0" 
      @click="handleTriggerClick"
      :aria-label="searchQuery ? 'جستجو' : 'باز کردن جستجو'"
    >
      <Search class="text-primary-foreground w-5 h-5" />
    </TheButton>
  </div>
</template>