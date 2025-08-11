<template>
  <div class="min-h-screen flex flex-col gap-4 default-inner-container pt-24 lg:pt-36">
    <h1 class="heading-5 font-bold text-primary mb-2">سبد خرید</h1>
    <div class="flex flex-col lg:flex-row gap-4 p-8 border-border border rounded-2xl bg-accent/20">

      <div class="flex flex-col gap-4 grow">
        <ProductCartCard class="bg-background" v-for="item in cartStore.cartItems" :key="item.id"
          :product="item.product" :item-id="item.id" :quantity="item.quantity" />
      </div>


      <div class="basis-1/4 sticky top-24 h-fit">
        <div class="bg-background p-4 border-border border rounded-2xl flex flex-col justify-between h-fit gap-8 mb-2">
          <div class="flex flex-col gap-4 grow">
            <div class="flex flex-row w-full justify-between items-baseline">
              <span class="caption-1 text-primary"> جمع کل بدون تخفیف</span>
              <p class="text-primary body-1">{{ formatPrice(totalPriceWithoutDiscount) }}
                <bdi class="text-primary caption-2">تومان</bdi>
              </p>
            </div>

            <div class="flex flex-row w-full justify-between items-baseline">
              <span class="caption-1 text-primary">
                جمع کل
                <bdi class="text-primary caption-2">({{ totalQuantity }})</bdi>
              </span>
              <p class="text-primary body-1">{{ formatPrice(totalPrice) }}
                <bdi class="text-primary caption-2">تومان</bdi>
              </p>
            </div>

            <div v-if="totalDiscount > 0" class="flex flex-row w-full justify-between items-baseline">
              <span class="caption-1 text-success">شما
                <small class="text-success body-2 font-bold">{{ totalDiscountPercentage.toFixed(0) }}%</small>
                سود کردید
              </span>

              <p class="text-success body-2">{{ formatPrice(totalDiscount) }}
                <bdi class="text-success caption-2">تومان</bdi>
              </p>
            </div>

          </div>

          <TheButton class="w-full" variant="default" to="/checkout/payment">
            پرداخت
          </TheButton>
        </div>
        <p class="text-destructive caption-1 px-1 text-center">
          هزینه این سفارش هنوز پرداخت نشده‌ و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند
        </p>
      </div>




    </div>


  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '@/stores/cart';
import { ProductCartCard } from '#components';

const cartStore = useCartStore();

const totalPrice = computed(() => {
  return cartStore.cartItems.reduce((acc, item) => acc + Number(item.line_total_with_discount.replace(/,/g, '')), 0);
})

const totalPriceWithoutDiscount = computed(() => {
  return cartStore.cartItems.reduce((acc, item) => acc + Number(item.line_total_without_discount.replace(/,/g, '')), 0);
})

const totalDiscount = computed(() => {
  return Number(totalPriceWithoutDiscount.value) - Number(totalPrice.value);
})

const totalDiscountPercentage = computed(() => {
  return (totalDiscount.value / totalPriceWithoutDiscount.value) * 100;
})

const totalQuantity = computed(() => {
  return cartStore.cartItems.reduce((acc, item) => acc + item.quantity, 0);
})

const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR');
}

/* const cartStore = useCartStore();

onMounted(() => {
  cartStore.fetchCart();
}) */
</script>

<style></style>