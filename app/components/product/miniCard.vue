<template>
  <div class="flex flex-col gap-2">
    <div v-if="props.product.image" class="image-container">
      <img :src="props.product.image.src" alt="product" />
    </div>
    <div class="content flex flex-col gap-2">
      <h3 class="heading-5">{{ props.product.name }}</h3>
      <ProductCardPrice :product="props.product" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/product.types';
import { ProductCardPrice } from './card';

const props = defineProps<{
  product: Product
}>()
</script>

<style></style>