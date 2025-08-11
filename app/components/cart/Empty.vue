<template>
  <div :class="class">
    <div class="relative w-fit mx-auto">
      <ShoppingCart class="size-10 mx-auto overflow-visible text-muted-foreground/40" />
      <X class="size-4 mx-auto overflow-visible absolute bottom-1/2 left-10/12 text-destructive z-10" />
    </div>
    <p class="body-2 text-muted-foreground mx-auto">
      سبد خرید شما خالی است
    </p>
    <TheButton v-if="route.path !== '/products'" variant="tonal" size="sm" class="w-fit mx-auto" to="/products">
      فروشگاه
    </TheButton>
  </div>

</template>

<script lang="ts" setup>
import { ShoppingCart, X } from 'lucide-vue-next';

const route = useRoute();

const props = defineProps<{
  class?: string;
}>();
</script>

<style></style>