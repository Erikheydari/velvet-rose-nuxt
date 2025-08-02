<template>
  <HeroSection />
  <div class="bg-secondary py-10 px">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 default-inner-container">
      <ProductCard v-for="product in productsStore.products" :key="product.id" :product="product" type="default" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HeroSection } from '~/components/sections';
import { ProductCard } from '~/components/product/card';
import { useProductsStore } from '~/stores/products';

const productsStore = useProductsStore()

onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>

<style></style>