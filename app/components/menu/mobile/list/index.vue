<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoriesStore } from '~/stores/categories'
import type { Category } from '~/types/product.types'
// import ProductCategoriesList from './CategoriesList.vue'
import { headerPages, headerContact, headerSocials } from '~/constants/headerNavItems'

// Types definitions
interface Props {
  activeTab: string
}

const props = defineProps<Props>()
const route = useRoute()

// State
const categoriesStore = useCategoriesStore()

const mainMenu = computed(() => {
  return {
    mainMenu: headerPages,
    contact: headerContact,
    socials: headerSocials
  }
})

const loadCategories = async () => {
  try {
    const response = await categoriesStore.fetchCategories()
    return response
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([
    loadCategories(),
  ])
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Product Categories Tab -->
    <MenuMobileListCategories v-if="activeTab === 'productCategories'" :main-categories="categoriesStore.categories" />

    <!-- Website Pages Tab -->
    <MenuMobileListPages v-if="activeTab === 'websitePages'" />
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  overflow: hidden;
}
</style>
