<template>
  <Carousel class="relative lg:w-full md:max-w-[90%] default-inner-container" :opts="{
    loop: true,
    align: alignSlider,
    direction: 'rtl',
  }">
    <CarouselContent>
      <CarouselItem v-if="localLoading" v-for="i in 4" :key="i" class="basis-[80%] sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pt-8">
        <SkeletonProduct />
      </CarouselItem>
      <CarouselItem v-else v-for="(product, index) in products" :key="index"
        class="basis-[80%] sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pt-8">
        <ProductCard :product="product" :type="props.type" />
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious class="lg:flex hidden" variant="outline" />
    <CarouselNext class="lg:flex hidden" variant="outline" />
  </Carousel>
</template>

<script lang="ts" setup>
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import type { Product } from '~/types/product.types';
import type { ProductCardType } from '@/components/product/card/index.vue';

const props = withDefaults(defineProps<{
  products: Product[]
  type: ProductCardType
  loading: boolean
  alignSlider: 'start' | 'center' | 'end'
}>(), {
  loading: true,
  alignSlider: 'start',
  type: 'default'
})


const localLoading = computed(() => {
  return props.loading || props.products.length === 0
})

</script>

<style scoped>
</style>