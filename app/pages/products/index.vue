<template>
  <div>
    <SectionsProductsHero />
    <SectionsProductsBanners class="mb-8 lg:mb-12" />
    <ProductGrid class="mb-8 lg:mb-12">
      <ProductCard v-for="product in productsStore.products" :key="product.id" :product="product" type="default" />
    </ProductGrid>
  </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products';

const productsStore = useProductsStore();

useHead({
  title: 'محصولات',
  meta: [
    { name: 'description', content: 'محصولات' }
  ]
})

onMounted(() => {
  productsStore.fetchProducts();
});

</script>

<style></style>