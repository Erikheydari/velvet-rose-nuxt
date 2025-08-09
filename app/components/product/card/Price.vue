<template>
  <div class="flex-1 flex flex-col items-start">
    <bdi v-if="props.product.discount_percentage > 0" class="body-2 text-muted-foreground line-through">
      {{ props.product.price }}
      <small>
        تومان
      </small>
    </bdi>
    <bdi class="heading-6 font-bold text-primary">
      {{ props.product.final_price }}
      <small>
        تومان
      </small>
    </bdi>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/product.types';

const props = defineProps<{
  product: Product
}>()
</script>

<style></style>