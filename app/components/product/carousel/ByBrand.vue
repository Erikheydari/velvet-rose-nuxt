<template>
  <ProductCarousel :products="products.slice(0, maxItems)" :loading="isLoading" :type="type" :align-slider="alignSlider"
    :navigation="false" slide-class="basis-[80%] sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pt-8 pb-4" />
</template>

<script lang="ts" setup>
import { useBrandsStore } from '@/stores/brands'
import type { ProductCardType } from '~/types/components/product.types';

interface Props {
  brandSlug: string
  alignSlider?: 'start' | 'center' | 'end'
  maxItems?: number
  type?: ProductCardType
}
const props = withDefaults(defineProps<Props>(), {
  alignSlider: 'center',
  maxItems: 6,
  type: 'default',
})

const brandsStore = useBrandsStore()

const products = computed(() => brandsStore.getBrandProducts(props.brandSlug))
const isLoading = computed(() => brandsStore.isBrandLoading(props.brandSlug))
</script>

<style></style>