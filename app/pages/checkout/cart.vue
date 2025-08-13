<template>
  <div class="min-h-screen flex flex-col default-inner-container pt-24 lg:pt-36">
    <h1 class="heading-5 font-bold text-primary mb-6">سبد خرید</h1>
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:p-8 p-4 border-border border rounded-2xl bg-accent/20">

      <div class="flex flex-col gap-4 grow">
        <template v-if="!isStoreReady || cartStore.loading">
          <TheSkeleton v-for="i in 3" :key="i" class="w-full h-32" />
        </template>


        <template v-else-if="isStoreReady && !cartStore.loading && cartStore.cartItems.length > 0">
          <ProductCartCard class="bg-background" v-for="item in cartStore.cartItems" :key="item.id"
            :product="item.product" :item-id="item.id" :quantity="item.quantity" />
        </template>


        <template v-else-if="isStoreReady && cartStore.cartItems.length === 0 && !cartStore.loading">
          <CartEmpty class="h-full flex flex-col justify-center items-center gap-4" />
        </template>

      </div>

      <CartBox v-if="isStoreReady" :button-text="'تکمیل سفارش'" :loading="cartStore.loading" :cart-items="cartStore.cartItems" />

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '@/stores/cart';
import { ProductCartCard } from '#components';
import { onMounted, computed } from 'vue';

const cartStore = useCartStore();
const isStoreReady = computed(() => !!cartStore);

onMounted(async () => {
  try {
    await cartStore.fetchCart();
  } catch (error) {
    console.error('Failed to fetch cart:', error);
  }
})

const title = computed(() => {
  return cartStore.cartItems.length > 0 ? 'سبد خرید' : 'سبد خرید خالی است';
})

useHead({
  title: title.value
})
</script>

<style></style>