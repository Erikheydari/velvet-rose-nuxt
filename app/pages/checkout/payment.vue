<template>
  <CheckoutLayout>
    <FormSetOrder />
    <template #cart-box>
      <CartBox :loading="cartStore.loading" :disabled="!paymentStore.paymentAuthority"
        :handle-click="() => paymentStore.initiatePayment()" :cart-items="cartStore.cartItems" button-text="پرداخت" />
    </template>
  </CheckoutLayout>
</template>

<script lang="ts" setup>
import CheckoutLayout from '@/layouts/checkout.vue';
import { usePaymentsStore } from '@/stores/payments';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
const paymentStore = usePaymentsStore();
const router = useRouter()
const computedTitle = computed(() => {
  if (paymentStore.paymentAuthority) {
    return 'پرداخت'
  }
  return 'ثبت سفارش'
})

definePageMeta({
  layout: false,
  title: computedTitle.value
})

//watch if cart is empty redirect to cart page
watch(cartStore.cartItems, (newVal) => {
  if (newVal.length === 0) {
    router.push('/checkout/cart')
  }
})

onMounted(async () => {
  await cartStore.fetchCart();
})
</script>

<style></style>