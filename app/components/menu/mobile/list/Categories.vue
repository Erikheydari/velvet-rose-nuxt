<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next';
import { ref, computed } from 'vue'
import type { Category } from '~/types/product.types'
// import CategoryItem from './CategoryItem.vue'

const props = defineProps<{
  mainCategories: Category[]
}>()

const route = useRoute()
// Replace single category with category path to track navigation
const categoryStack = ref<Category[]>([])

// Computed properties
const randomCategories = computed(() => {
  if (!props.mainCategories?.length) return []

  return [...props.mainCategories]
    .sort(() => 0.5 - Math.random())
    .slice(0, 6)
})

// Current category being displayed is the last one in the stack, or null if at root
const currentCategory = computed(() => {
  return categoryStack.value.length > 0
    ? categoryStack.value[categoryStack.value.length - 1]
    : null
})

// Methods
const showCategoryChildren = (category: Category) => {
  if (category.children && category.children.length > 0) {
    categoryStack.value.push(category)
  }
}

const navigateBack = () => {
  if (categoryStack.value.length > 0) {
    categoryStack.value.pop()
  }
}

const isCategoryActive = (categorySlug: string) => {
  return route.path === '/products/' + categorySlug
}
</script>

<template>
  <div class="overflow-y-auto h-full menu-body-height">
    <!-- Subcategory view -->
    <div v-if="currentCategory" class="flex flex-col">
      <div class="w-full flex items-center pl-2 h-13 border-b border-border gap-2" @click="navigateBack">
        <TheButton variant="ghost" size="icon" class="h-13 w-10 rounded-none" aria-label="Back to previous categories">
          <ChevronLeft class="text-xl" />
        </TheButton>
        <!-- Show breadcrumb-style navigation -->
        <h3 class="heading-6 truncate">{{ currentCategory.name }}</h3>
      </div>

      <ul class="w-full">
        <li v-for="child in currentCategory.children" :key="child.id"
          class="border-b border-b-border/50 last:border-b-0">
          <MenuMobileListItem :category="child" :is-active="isCategoryActive(child.slug)"
            :show-sub-category-button="(child.children?.length ?? 0) > 0" @show-sub-categories="showCategoryChildren" />
        </li>
      </ul>
    </div>

    <!-- Main categories view -->
    <div v-else class="flex flex-col h-full">
      <ul class="grow">
        <li class="border-b border-b-border/50 last:border-b-0" v-for="category in mainCategories" :key="category.id">
          <MenuMobileListItem :category="category" :is-active="isCategoryActive(category.slug)"
            :show-sub-category-button="(category.children?.length ?? 0) > 0"
            @show-sub-categories="showCategoryChildren" />
        </li>
      </ul>

      <div class="mt-4 h-14 px-4 flex items-center w-full overflow-x-auto thin-scrollbar-thumb overflow-y-hidden">
        <span class="text-secondary caption-1 whitespace-nowrap ml-2">دسته‌بندی‌های پرطرفدار:</span>
        <div v-for="(category, index) in randomCategories" :key="index" class="bg-primary-50 ml-2 rounded-md">
          <TheButton variant="ghost" size="sm" :to="'/products/' + category.slug"
            class="w-fit whitespace-nowrap text-sm px-2 py-1.5 text-primary hover:text-primary">
            {{ category.name }}
          </TheButton>
        </div>
      </div>
    </div>
  </div>
</template>