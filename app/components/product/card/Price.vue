<template>
  <div class="flex-1 flex flex-col items-start">
    <bdi v-if="props.product.discount_percentage > 0" class="text-muted-foreground line-through" :class="discountClass">
      {{ props.product.price }}
      <small>
        تومان
      </small>
    </bdi>
    <bdi class="font-bold text-primary" :class="sizeClass">
      {{ props.product.final_price }}
      <small>
        تومان
      </small>
    </bdi>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/product.types';

const props = withDefaults(defineProps<{
  product: Product
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md'
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'body-1'
    case 'md':
      return 'heading-6'
    case 'lg':
      return 'heading-5'
  }
})

const discountClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'caption-1'
    case 'md':
      return 'body-2'
    case 'lg':
      return 'body-2'
  }
})
</script>

<style></style>