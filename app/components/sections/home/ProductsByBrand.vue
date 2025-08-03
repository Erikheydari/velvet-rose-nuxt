<template>
  <div class="w-full relative py-[5%] h-screen">

    <div class="flex flex-col justify-center items-center relative mb-[5%]">
      <h3 class="heading-2 font-extrabold text-primary relative z-0 leading-none">
        {{ props.title }}
      </h3>
      <div class="h-35 background-gradient absolute left-0 bottom-0 w-full z-1"></div>
      <p class="relative z-2 heading-3 font-light! leading-none -mt-[2%] text-primary">
        {{ props.description }}
      </p>
    </div>

    <TheCarousel dir="rtl" class="h-[calc(100vh-400px)] relative z-1" :opts="{
      loop: true,
      direction: 'rtl',
      align: 'center',
      containScroll: 'keepSnaps'
    }" @init-api="(val) => emblaMainApi = val">
      <TheCarouselContent class="-ml-[10%]">
        <TheCarouselItem v-for="(product, index) in products" :key="product.id"
          class="basis-full sm:basis-1/2 lg:basis-1/3 flex items-end justify-center relative pt-[8%] pl-[10%]">
          <div :class="[
            'transition-all duration-500 origin-bottom',
            { 'scale-[1.6]': index === selectedIndex, 'scale-100': index !== selectedIndex }
          ]">
            <figure class="aspect-square max-h-[300px] w-auto">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-contain" />
            </figure>
          </div>
        </TheCarouselItem>
      </TheCarouselContent>

      <TheCarouselPrevious
        class="border-none shadow-none [&>svg]:size-10 z-10 absolute left-20 top-1/2 translate-y-[60%]" />
      <TheCarouselNext
        class="border-none shadow-none [&>svg]:size-10 z-10 absolute right-20 top-1/2 translate-y-[60%]" />

      <div class="flex justify-between absolute w-full left-0 top-1/2 -z-1 -translate-y-1/12 h-[38%]">
        <div class="bg-secondary w-[20%] h-full rounded-l-full" />
        <div class="bg-secondary w-[20%] h-full rounded-r-full" />
      </div>

    </TheCarousel>



    <div class="flex justify-center">
      <TheButton size="lg" :as="NuxtLink" to="/products">
        مشاهده همه
      </TheButton>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { TheCarousel, TheCarouselContent, TheCarouselItem, TheCarouselPrevious, TheCarouselNext } from '#components';
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
  background: var(--color-background);
  background: linear-gradient(0deg, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0) 100%);
}
</style>