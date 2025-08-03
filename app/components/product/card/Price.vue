<template>
  <div class="flex-1 flex items-baseline gap-4">
    <bdi class="body-1 text-primary">
      {{ props.product.final_price }}
      <small>
        تومان
      </small>
    </bdi>
    <bdi v-if="props.product.discount_percentage > 0" class="text-base text-muted-foreground line-through">
      {{ props.product.price }}
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