<template>
  <section class="bg-secondary py-10 px">
    <h3 v-if="props.title" class="heading-3 text-primary text-center mb-4">
      {{ props.title }}
    </h3>
    <p v-if="props.description" class="text-center text-muted-foreground mb-12 text-lg">
      {{ props.description }}
    </p>

    <Carousel class="relative w-full default-inner-container mb-12" :opts="{
      align: 'start',
    }">
      <CarouselContent>
        <CarouselItem v-for="(product, index) in products" :key="index" class="md:basis-1/2 lg:basis-1/3 pt-8">
          <ProductCard :product="product" :type="props.type" />
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>


    <div class="flex justify-center">
      <TheButton size="lg">
        مشاهده همه
      </TheButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ProductCard } from '~/components/product/card';
import type { Product } from '~/types/product.types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';

const props = defineProps<{
  title?: string
  description?: string
  products: Product[]
  type: 'default' | 'secondary' | 'primary'
}>()

</script>

<style></style>