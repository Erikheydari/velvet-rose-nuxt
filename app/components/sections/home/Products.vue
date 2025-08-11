<template>
  <section class="bg-secondary py-10">
    <slot />

    <ProductCarousel :products="products" :type="props.type" :align-slider="alignSlider" class="mb-8" :loading="props.loading"   />


    <div class="flex justify-center">
      <TheButton size="lg" to="/products">
        مشاهده همه
      </TheButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/product.types';
import { useWindowSize } from '@vueuse/core';
import type { ProductCardType } from '@/components/product/card/index.vue';

const { width } = useWindowSize()

const alignSlider = computed(() => width.value > 1024 ? 'start' : 'center')

//props with default value
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  products: Product[]
  type: ProductCardType
  to?: string
  loading: boolean
}>(), {
  type: 'default',
  title: 'محصولات آرایشی بهداشتی',
  description: 'تمامی محصولات کاملا اورجینال و از معتبر ترین برند های دنیا میباشند',
  loading: true,
})
</script>

<style></style>