<script lang="ts" setup>
import { Search } from 'lucide-vue-next'
import LogoSearch from '~/assets/icons/logo-search.svg?component'

const props = defineProps<{
  searchQuery: string
  handleButtonClick: () => void
}>()

const handleTriggerClick = (event: MouseEvent | KeyboardEvent) => {
  event.preventDefault()
  event.stopPropagation()
  props.handleButtonClick()
}
</script>

<template>
  <div
    @click="handleTriggerClick"
    class="w-full bg-input lg:bg-transparent lg:w-auto lg:max-w-md rounded-full flex justify-between relative items-center px-4 lg:px-0">
    <label class="lg:hidden inline-flex items-center text-muted-foreground">
      جستجو در
      <LogoSearch class="size-20 h-12" />
    </label>
    <TheButton variant="tonal" size="icon-lg" class="px-0! w-fit lg:w-12 lg:px-4" @click="handleTriggerClick"
      :aria-label="searchQuery ? 'جستجو' : 'باز کردن جستجو'">
      <Search class="size-5" />
    </TheButton>
  </div>
</template>