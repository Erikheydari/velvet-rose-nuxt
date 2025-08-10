<template>
  <div class="flex gap-4 w-full rounded-2xl border border-border p-4">
    <figure v-if="props.product.image" class="image-container w-58 h-auto bg-muted">
      <img :src="props.product.image.src" alt="product" class="aspect-square object-cover" />
    </figure>
    <div class="content flex flex-col gap-2 items-start py-6 justify-between">
      <div>
        <h3 class="heading-5 mb-2 font-bold">{{ props.product.name }}</h3>
        <div class="flex gap-2 flex-wrap">
          <span v-for="(option, index) in props.product.options" :key="index" class="caption-1 text-muted-foreground">{{
            option }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 w-full items-start">
        <ColorSwatches :colors="props.product.attributes.color" orientation="horizontal" />
        <ProductCardPrice :product="props.product" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/product.types';
import { ProductCardPrice } from '../card';
import ColorSwatches from '@/components/product/card/ColorSwatches.vue';

const props = defineProps<{
  product: Product
}>()
</script>

<style></style>