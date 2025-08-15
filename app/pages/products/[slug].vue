<template>
  <div class="min-h-screen default-inner-container default-padding-top">
    <ProductGrid 
      :filterable="false" 
      :loading="categoriesStore.isLoading"
      :title="pageTitle"
    >
      <ProductCard 
        v-for="product in categoryProducts" 
        :key="product.id" 
        :product="product"
        type="default" 
      />

      <template #empty>
        <ProductEmpty 
          :category-name="categoriesStore.category?.name"
          class="py-16"
        />
      </template>
    </ProductGrid>
  </div>
</template>

<script setup lang="ts">
import { useCategoriesStore } from '~/stores/categories';

const route = useRoute();
const { slug } = route.params;

const categoriesStore = useCategoriesStore();

// Computed values
const categoryProducts = computed(() => {
  return categoriesStore.category?.products || []
})

const pageTitle = computed(() => {
  return categoriesStore.getCategoryName(slug as string) || 'محصولات دسته‌بندی'
})

// Fetch logic
const fetchCategoryProducts = async (slugParam: string | string[]) => {
  if (typeof slugParam === 'string' && slugParam) {
    await categoriesStore.fetchCategoryBySlug(slugParam)
  }
}

// Watch for route changes
watch(
  () => route.params.slug,
  (newSlug, oldSlug) => {
    if (newSlug && newSlug !== oldSlug) {
      fetchCategoryProducts(newSlug)
    }
  }
)

// Initial fetch
onMounted(() => {
  fetchCategoryProducts(slug)
})

// SEO
useHead({
  title: pageTitle.value,
  meta: [
    { 
      name: 'description', 
      content: () => `مشاهده محصولات ${categoriesStore.category?.name || 'دسته‌بندی'} در فروشگاه آنلاین` 
    }
  ]
})
</script>

<style scoped></style>