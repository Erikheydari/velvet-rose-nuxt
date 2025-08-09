<template>
  <section class="bg-secondary py-10">
    <slot />

    <Carousel class="relative lg:w-full md:max-w-[90%] default-inner-container mb-12" :opts="{
      loop: true,
      align: alignSlider,
      direction: 'rtl',
    }">
      <CarouselContent>
        <CarouselItem v-for="(product, index) in products" :key="index"
          class="basis-[80%] sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4 pt-8">
          <ProductCard :product="product" :type="props.type" />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="lg:flex hidden" variant="outline" />
      <CarouselNext class="lg:flex hidden" variant="outline" />
    </Carousel>


    <div class="flex justify-center">
      <TheButton size="lg" to="/products">
        مشاهده همه
      </TheButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ProductCard } from '~/components/product/card';
import type { Product } from '~/types/product.types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize()

const alignSlider = computed(() => width.value > 1024 ? 'start' : 'center')

//props with default value
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  products: Product[]
  type: 'default' | 'secondary' | 'primary'
  to?: string
}>(), {
  type: 'default',
  title: 'محصولات آرایشی بهداشتی',
  description: 'تمامی محصولات کاملا اورجینال و از معتبر ترین برند های دنیا میباشند',
})
</script>

<style></style>