<template>
  <div class="basis-1/4 sticky top-24 h-fit">
    <div class="bg-background p-4 border-border border rounded-2xl flex flex-col justify-between h-fit gap-8 mb-2">
      <div class="flex flex-col gap-4 grow">
        <div class="flex flex-row w-full justify-between items-baseline">
          <span class="caption-1 text-primary"> جمع کل بدون تخفیف</span>
          <template v-if="!loading">
            <p class="text-primary body-1">{{ formatPrice(totalPriceWithoutDiscount) }}
              <bdi class="text-primary caption-2">تومان</bdi>
            </p>
          </template>

          <template v-else>
            <TheSkeleton class="w-24 h-6" />
          </template>
        </div>

        <div class="flex flex-row w-full justify-between items-baseline">
          <span class="caption-1 text-primary">
            جمع کل
            <bdi class="text-primary caption-2">({{ totalQuantity }})</bdi>
          </span>

          <template v-if="!loading">
            <p class="text-primary body-1">{{ formatPrice(totalPrice) }}
              <bdi class="text-primary caption-2">تومان</bdi>
            </p>
          </template>

          <template v-else>
            <TheSkeleton class="w-24 h-6" />
          </template>
        </div>

        <div v-if="totalDiscount > 0" class="flex flex-row w-full justify-between items-baseline">
          <template v-if="!loading">
            <span class="caption-1 text-success">شما
              <small class="text-success body-2 font-bold">{{ totalDiscountPercentage.toFixed(0) }}%</small>
              سود کردید
            </span>
          </template>

          <template v-else>
            <TheSkeleton class="w-24 h-6" />
          </template>


          <template v-if="!loading">
            <p class="text-success body-2">{{ formatPrice(totalDiscount) }}
              <bdi class="text-success caption-2">تومان</bdi>
            </p>
          </template>

          <template v-else>
            <TheSkeleton class="w-24 h-6" />
          </template>
        </div>

      </div>

      <TheButton v-if="buttonIsActive" class="w-full" :disabled="loading || disabled" :class="{ 'opacity-50 cursor-not-allowed': loading }"
        variant="default" size="lg" @click="handleClick">
        {{ buttonText }}
      </TheButton>
    </div>
    <p class="text-destructive caption-1 px-1 text-center">
      هزینه این سفارش هنوز پرداخت نشده‌ و در صورت اتمام موجودی، کالاها از سبد حذف می‌شوند
    </p>
  </div>

</template>

<script lang="ts" setup>
import type { CartItem } from '@/types/cart.types';

interface Props {
  cartItems: ReadonlyArray<CartItem>
  buttonText?: string
  loading?: boolean
  handleClick?: () => void
  disabled?: boolean
  buttonIsActive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'پرداخت',
  buttonIsActive: true,
  loading: true,
  handleClick: () => {
    navigateTo('/checkout/payment')
  }
})

const totalPrice = computed(() => {
  return props.cartItems.reduce((acc, item) => acc + Number(item.line_total_with_discount.replace(/,/g, '')), 0);
})

const totalPriceWithoutDiscount = computed(() => {
  return props.cartItems.reduce((acc, item) => acc + Number(item.line_total_without_discount.replace(/,/g, '')), 0);
})

const totalDiscount = computed(() => {
  return Number(totalPriceWithoutDiscount.value) - Number(totalPrice.value);
})

const totalDiscountPercentage = computed(() => {
  return (totalDiscount.value / totalPriceWithoutDiscount.value) * 100;
})

const totalQuantity = computed(() => {
  return props.cartItems.reduce((acc, item) => acc + item.quantity, 0);
})

const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR');
}
</script>

<style></style>