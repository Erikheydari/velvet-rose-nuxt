<template>
  <div class="w-full relative py-[20%] lg:py-[5%] lg:pb-0 lg:min-h-screen mb-20">
    <FantastyHeading :title="props.title" :description="props.description" />
    <TheCarousel dir="rtl" class="carousel-container lg:pt-[2%] lg:pb-0 relative z-1 " :opts="{
      loop: true,
      direction: 'rtl',
      align: 'center',
      containScroll: 'keepSnaps'
    }" @init-api="(val) => emblaMainApi = val">
      <TheCarouselContent class="relative ml-0 z-1">
        <TheCarouselItem v-if="localLoading" v-for="(i, index) in 4" :key="i"
          class="basis-full md:basis-1/3 flex items-end justify-center relative pt-[30%] md:pt-[10%] lg:pt-[8%] pl-0">
          <div :class="[
            'transition-all duration-500  md:max-w-none lg:max-w-[15vw]',
            { 'scale-130 md:scale-[1.2] lg:scale-[1.6] lg:translate-x-1/7': index === selectedIndex, 'md:scale-60 lg:scale-100': index !== selectedIndex }
          ]">
            <SkeletonProduct class="aspect-square w-auto product-image h-100" />
          </div>
        </TheCarouselItem>
        <TheCarouselItem v-else v-for="(product, index) in products" :key="product.id"
          class="basis-full md:basis-1/3 flex items-end justify-center relative pt-[30%] md:pt-[10%] lg:pt-[8%] pl-0">
          <div :class="[
            'transition-all duration-500 origin-bottom md:max-w-none lg:max-w-[15vw] ',
            { 'scale-130 md:scale-[1.2] lg:scale-[1.6]': index === selectedIndex, 'md:scale-60 lg:scale-100': index !== selectedIndex }
          ]">
            <NuxtLink :to="`/product/${product.slug}`" class="aspect-square w-auto product-image">
              <img :src="`${product.image?.src}`" :alt="product.name" class="w-full h-full object-contain" />
            </NuxtLink>
          </div>
        </TheCarouselItem>
      </TheCarouselContent>
      <TheCarouselPrevious
        class="brand-carousel-nav border-none shadow-none [&>svg]:size-10 z-0 absolute  bg-secondary left-0 w-[25vw] h-[28%] rounded-r-full rounded-l-none [&>svg]:-ml-[60%]" />
      <TheCarouselPrevious
        class="brand-carousel-nav border-none [&>svg]:size-10 z-2 absolute bg-secondary left-0 w-[15%] h-[28%] opacity-0" />
      <TheCarouselNext
        class="brand-carousel-nav border-none  shadow-none [&>svg]:size-10 z-0 absolute bg-secondary right-0 w-[25%] h-[28%] rounded-l-full rounded-r-none [&>svg]:-mr-[60%]" />
      <TheCarouselNext
        class="brand-carousel-nav border-none [&>svg]:size-10 z-2 absolute bg-secondary right-0 w-[15%] h-[28%] opacity-0" />
    </TheCarousel>
    <div class="flex justify-center">
      <TheButton size="lg" to="/brands" variant="outline">
        مشاهده همه برندها
      </TheButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Product } from '~/types/product.types';
import type { CarouselApi } from '~/components/ui/carousel';
import { ref, watch } from 'vue';
import { FantastyHeading } from '~/components/ui/heading';
import { useBrandsStore } from '~/stores/brands';

const brandsStore = useBrandsStore()

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
  loading: boolean;
}>();

const localLoading = computed(() => {
  return props.loading || props.products.length === 0
})

onMounted(() => {
  brandsStore.fetchBrandProductsBySlug('tom-ford')
})
</script>
<style scoped>
.product-image {
  max-height: clamp(15rem, min(35vw, 45vh), 20rem);
}

.carousel-container {
  padding-bottom: clamp(2rem, 8vw, 4rem);
  padding-top: clamp(1rem, 5vw, 3rem);
}

.brand-carousel-nav {
  bottom: 10rem;
  transform: translateY(80%);
}
</style>