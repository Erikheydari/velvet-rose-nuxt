<template>
  <Carousel class="relative lg:w-full" :opts="{
    loop: true,
    align: alignSlider,
    direction: 'rtl',
  }" :class="navigation ? 'md:max-w-[90%] default-inner-container' : ''">
    <CarouselContent>
      <CarouselItem v-if="localLoading" v-for="i in 4" :key="i" :class="slideClass">
        <SkeletonProduct />
      </CarouselItem>
      <CarouselItem v-else v-for="(product, index) in products" :key="index" :class="slideClass">
        <ProductCard :product="product" :type="props.type">
          <template #swatches>
            <ProductCardColorSwatches
              v-if="product.attributes && product.attributes.color && product.attributes.color.length > 0"
              :colors="product.attributes.color" class="absolute! top-4! right-4! z-2" orientation="vertical"
              size="lg" />
          </template>
        </ProductCard>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious v-if="navigation" class="lg:flex hidden" variant="outline" />
    <CarouselNext v-if="navigation" class="lg:flex hidden" variant="outline" />
  </Carousel>
</template>

<script lang="ts" setup>
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import type { Product } from '~/types/product.types';
import type { ProductCardType } from '~/types/components/product.types';

const props = withDefaults(defineProps<{
  products: Product[]
  type: ProductCardType
  loading: boolean
  navigation?: boolean
  slideClass?: string
  alignSlider?: 'start' | 'center' | 'end'
}>(), {
  loading: true,
  navigation: true,
  alignSlider: 'start',
  type: 'default',
  swatchesSize: 'md',
  slideClass: 'basis-[80%] sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pt-8'
})


const localLoading = computed(() => {
  return props.loading || props.products.length === 0
})

</script>

<style scoped></style>