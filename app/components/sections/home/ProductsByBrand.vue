<template>
  <div class="w-full relative py-[20%] lg:py-[5%] lg:h-screen">
    <div class="flex flex-col justify-center items-center relative mb-[5%]">
      <h3 class="heading-2 font-extrabold text-primary relative z-0 leading-none">
        {{ props.title }}
      </h3>
      <div class="background-gradient absolute left-0 bottom-0 w-full z-1"></div>
      <p class="relative z-2 heading-3 font-light! leading-none -mt-[2%] text-primary">
        {{ props.description }}
      </p>
    </div>
    <TheCarousel dir="rtl" class="carousel-container lg:pt-[2%] lg:pb-0 lg:h-[calc(100vh-300px)] relative z-1" :opts="{
      loop: true,
      direction: 'rtl',
      align: 'center',
      containScroll: 'keepSnaps'
    }" @init-api="(val) => emblaMainApi = val">
      <TheCarouselContent class="relative z-1">
        <TheCarouselItem v-for="(product, index) in products" :key="product.id"
          class="basis-full md:basis-1/3 flex items-end justify-center relative pt-[20%] lg:pt-[8%]">
          <div :class="[
            'transition-all duration-500 origin-bottom md:max-w-none lg:max-w-[15vw] ',
            { 'scale-130 md:scale-[1.2] lg:scale-[1.6]': index === selectedIndex, 'md:scale-80 lg:scale-100': index !== selectedIndex }
          ]">
            <figure class="aspect-square w-auto product-image">
              <img :src="`${product.image?.src}`" :alt="product.name" class="w-full h-full object-contain" />
            </figure>
          </div>
        </TheCarouselItem>
      </TheCarouselContent>
      <TheCarouselPrevious
        class="border-none shadow-none [&>svg]:size-10 z-0 absolute top-1/2 -translate-y-1/12 bg-secondary left-0 w-[15%] h-[28%] rounded-r-full rounded-l-none" />
      <TheCarouselPrevious
        class="border-none [&>svg]:size-10 z-2 absolute top-1/2 -translate-y-1/12 bg-secondary left-0 w-[15%] h-[28%] opacity-0" />
      <TheCarouselNext
        class="border-none shadow-none [&>svg]:size-10 z-0 absolute top-1/2 -translate-y-1/12 bg-secondary right-0 w-[15%] h-[28%] rounded-l-full rounded-r-none" />
      <TheCarouselNext
        class="border-none [&>svg]:size-10 z-2 absolute top-1/2 -translate-y-1/12 bg-secondary right-0 w-[15%] h-[28%] opacity-0" />
    </TheCarousel>
    <div class="flex justify-center">
      <TheButton size="lg" :as="NuxtLink" to="/products" variant="outline">
        مشاهده همه
      </TheButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TheCarousel, TheCarouselContent, TheCarouselItem, TheCarouselPrevious, TheCarouselNext, NuxtLink } from '#components';
import type { Product } from '~/types/product.types';
import type { CarouselApi } from '~/components/ui/carousel';
import { ref, watch } from 'vue';
const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);
function onSelect() {
  if (!emblaMainApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
  if (emblaThumbnailApi.value) {
    emblaThumbnailApi.value.scrollTo(selectedIndex.value);
  }
}
watch(emblaMainApi, (api) => {
  if (!api) return;
  onSelect();
  api.on('select', onSelect);
  api.on('reInit', onSelect);
});
const props = defineProps<{
  products: Product[];
  title: string;
  description: string;
}>();
</script>
<style scoped>
.background-gradient {
  height: clamp(5rem, 10vh, 10rem);
  background: var(--color-background);
  background: linear-gradient(0deg, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0) 100%);
}

.product-image {
  max-height: clamp(15rem, min(35vw, 45vh), 20rem);
}

.carousel-container {
  padding-bottom: clamp(2rem, 8vw, 4rem);
  padding-top: clamp(1rem, 5vw, 3rem);
}
</style>Z