<template>
  <div>
    <SectionsProductsHero />
    <SectionsProductsBanners />
    <ProductGrid>
      <ProductCard v-for="product in productsStore.products" :key="product.id" :product="product" type="default" />
    </ProductGrid>
  </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products';
import { ProductCard } from '@/components/product/card';

const productsStore = useProductsStore();

onMounted(() => {
  productsStore.fetchProducts();
});

</script>

<style></style>