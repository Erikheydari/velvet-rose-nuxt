<script setup lang="ts">
import type { Category } from '~/types/product.types'

defineProps<{
  category: Category
  isActive: boolean
  showSubCategoryButton?: boolean
}>()

const emit = defineEmits<{
  showSubCategories: [category: Category]
}>()

const handleShowSubCategories = (event: Event, category: Category) => {
  event.preventDefault()
  event.stopPropagation()
  emit('showSubCategories', category)
}
</script>

<template>
  <NuxtLink 
    :to="'/product-category/' + category.slug"
    class="w-full flex pr-4 items-center h-13 justify-between"
    :class="{ 'bg-primary/5': isActive }"
  >
    <span class="body-3">{{ category.name }}</span>
    
    <TheButton 
      v-if="showSubCategoryButton"
      variant="ghost" 
      size="icon" 
      class="h-13 w-13 rounded-none"
      @click="handleShowSubCategories($event, category)"
      aria-label="Show subcategories"
    >
      <Icon name="hugeicons:arrow-left-01" class="text-xl" />
    </TheButton>
  </NuxtLink>
</template> 