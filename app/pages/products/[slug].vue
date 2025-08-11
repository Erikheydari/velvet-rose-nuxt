<template>
    <div class="min-h-screen default-inner-container pt-36 lg:pt-24">
        <ProductGrid v-if="categoriesStore.category" :filterable="false" :loading="categoriesStore.isLoading" :title="categoriesStore.getCategoryName(slug)">
            <ProductCard v-for="product in categoriesStore.category.products" :key="product.id" :product="product" type="default" />
        </ProductGrid>
    </div>
</template>

<script setup>
import { ProductGrid } from '#components';
import { useCategoriesStore } from '~/stores/categories';

const route = useRoute();
const { slug } = route.params;

const categoriesStore = useCategoriesStore();

watch(
  () => route.params.slug,
  (newSlug) => {
    if (typeof newSlug === 'string' && newSlug) {
      categoriesStore.fetchCategoryBySlug(newSlug)
    }
  }
)

onMounted(async () => {
    await categoriesStore.fetchCategoryBySlug(slug);
});
</script>

<style scoped></style>