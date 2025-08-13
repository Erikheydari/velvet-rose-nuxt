<template>
  <CheckoutLayout :title="title">
    <FormSetOrder />
    <template #cart-box>
      <CartBox :loading="cartStore.loading" :disabled="!paymentStore.paymentAuthority"
        :button-is-active="paymentStore.paymentAuthority ? true : false"
        :handle-click="() => paymentStore.initiatePayment()" :cart-items="cartStore.cartItems" button-text="پرداخت" />
    </template>
  </CheckoutLayout>
</template>

<script lang="ts" setup>
import CheckoutLayout from '@/layouts/checkout.vue';
import { usePaymentsStore } from '@/stores/payments';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const paymentStore = usePaymentsStore();
const router = useRouter()

definePageMeta({
  layout: false,
})

const title = computed(() => {
  return paymentStore.paymentAuthority ? 'پرداخت' : 'ثبت سفارش'
})

useHead({
  title: () => {
    const { paymentAuthority } = usePaymentsStore()
    return paymentAuthority ? 'پرداخت' : 'ثبت سفارش'
  }
})

watch(cartStore.cartItems, (newVal) => {
  if (newVal.length === 0 && !paymentStore.paymentAuthority) {
    router.push('/checkout/cart')
  }
})

onMounted(async () => {
  await cartStore.fetchCart();
})
</script>

<style></style>