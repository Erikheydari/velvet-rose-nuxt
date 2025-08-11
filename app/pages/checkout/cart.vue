<template>
  <div class="min-h-screen flex flex-col default-inner-container pt-24 lg:pt-36">
    <h1 class="heading-5 font-bold text-primary mb-6">سبد خرید</h1>
    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:p-8 p-4 border-border border rounded-2xl bg-accent/20">

      <div class="flex flex-col gap-4 grow">
        <template v-if="!cartStore.loading">
          <ProductCartCard class="bg-background" v-for="item in cartStore.cartItems" :key="item.id"
            :product="item.product" :item-id="item.id" :quantity="item.quantity" />
        </template>

        <template v-if="cartStore.loading">
          <TheSkeleton v-for="i in 3" :key="i" class="w-full h-32" />
        </template>

      </div>

      <CartBox :button-text="'تکمیل سفارش'"
      :loading="cartStore.loading" :cart-items="cartStore.cartItems"/>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '@/stores/cart';
import { usePaymentsStore } from '@/stores/payments';
import { ProductCartCard } from '#components';

const cartStore = useCartStore();
const paymentStore = usePaymentsStore();

onMounted(async () => {
  await cartStore.fetchCart();
})
</script>

<style></style>