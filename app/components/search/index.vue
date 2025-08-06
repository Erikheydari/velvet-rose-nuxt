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
  <TheButton variant="tonal" size="icon-lg" class="" @click="handleTriggerClick"
    :aria-label="searchQuery ? 'جستجو' : 'باز کردن جستجو'">
    <Search class="w-5 h-5" />
  </TheButton>
</template>