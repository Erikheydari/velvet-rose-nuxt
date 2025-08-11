<template>
  <div class="min-h-screen flex flex-col default-inner-container py-12">
    <div class="flex flex-row gap-4 justify-between w-full border border-border bg-accent/20 rounded-2xl p-8 mb-6">
      <TheButton to="/checkout/cart" variant="link">
        <ArrowRight class=" size-4" />
        بازگشت به سبد خرید
      </TheButton>
      <h1 class="heading-5 font-bold text-primary mx-auto text-center absolute left-1/2 -translate-x-1/2">
        {{ props.title }}
      </h1>
    </div>


    <div class="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:p-8 p-4 border-border border rounded-2xl bg-accent/20">
      <div class="grow flex flex-col gap-4">
        <slot />
      </div>
      <slot name="cart-box" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from 'lucide-vue-next';

const cartStore = useCartStore();
const route = useRoute()

interface Props {
  title: string
}
const props = defineProps<Props>()

onMounted(async () => {
  await cartStore.fetchCart();
})

</script>

<style></style>