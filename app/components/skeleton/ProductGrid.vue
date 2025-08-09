<template>
  <div class="product-grid" aria-busy="true">
    <Skeleton v-for="i in count" :key="i" class="aspect-[328/455] rounded-xl" />
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '~/components/ui/skeleton'

withDefaults(defineProps<{ count?: number }>(), {
  count: 8,
})
</script>

<style scoped>
@import '~/assets/css/tailwind.css';

.product-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-stretch;
}

@media (min-width: 1920px) {
  .product-grid {
    @apply grid-cols-4;
  }
}
</style> 