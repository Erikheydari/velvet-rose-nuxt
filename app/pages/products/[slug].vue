<template>
    <div>
        <h1>{{ categoriesStore.category.name }}</h1>
        <ProductGrid v-if="categoriesStore.category">
            <ProductCard v-for="product in categoriesStore.category.products" :key="product.id" :product="product" type="default" />
        </ProductGrid>
    </div>
</template>

<script setup>
import { ProductGrid } from '#components';
import { useCategoriesStore } from '~/stores/categories';

const route = useRoute();
const { slug } = route.params;

const product = ref(null);

const categoriesStore = useCategoriesStore();

onMounted(async () => {
    await categoriesStore.fetchCategoryBySlug(slug);
});
</script>

<style scoped></style>