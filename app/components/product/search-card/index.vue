<template>
  <div class="flex gap-4 w-full rounded-2xl border border-border p-2 lg:p-4">
    <figure v-if="props.product.image" class="image-container aspect-square w-1/4 lg:max-w-58 h-auto bg-muted relative">
      <img :src="props.product.image.src" alt="product" class="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
    </figure>
    <div class="content flex flex-col gap-2 items-start py-2 lg:py-6 justify-between">
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
import ProductCardPrice from '@/components/product/card/Price.vue';
import ColorSwatches from '@/components/product/card/ColorSwatches.vue';

const props = defineProps<{
  product: Product
}>()
</script>

<style></style>