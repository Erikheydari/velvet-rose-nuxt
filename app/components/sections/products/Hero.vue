<template>
  <section class="flex  items-center justify-center hero-height overflow-hidden bg-background mb-8 lg:mb-12">

    <div class="right-image absolute translate-x-[40%] md:translate-x-[30%] -translate-y-1/2 image-container">
      <div class="bg-secondary rounded-object absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0">
      </div>
      <img src="/images/products/women.webp" alt="محصولات ما" />
    </div>

    <div
      class="flex flex-col items-center justify-center md:w-full lg:gap-4 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-[80%] lg:-translate-y-1/2 z-5">
      <h1 class="heading-2 text-primary font-extrabold text-nowrap">
        محصولات ما
      </h1>
      <p class="body-1 text-center max-w-2/3 md:max-w-full">
        با کیفیت ترین محصولات از لوکس ترین برند های دنیا
      </p>
    </div>
    <div
      class="brands-container absolute bottom-[13%] md:bottom-[18%] lg:bottom-[25%] xl:bottom-[15%] left-1/2 -translate-x-1/2 z-2 w-full max-w-[70%] lg:max-w-[50%] h-30 overflow-hidden">
      <div class="brands-wrapper">
        <div class="brands-track">
          <template v-for="i in 5" :key="`set-${i}`">
            <div v-for="brand in brands" :key="`${i}-${brand.id}`" class="brand-item">
              <img v-if="brand.banner" :src="brand.banner" alt="brand" class="h-30 w-auto object-contain" />
            </div>
          </template>
        </div>
      </div>
      <span class="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-background to-transparent z-1" />
      <span class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-background to-transparent z-1" />
    </div>

    <div class="left-image absolute -translate-x-[40%] md:-translate-x-[30%] -translate-y-1/2 image-container">
      <div class="bg-secondary rounded-object absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 z-0">
      </div>
      <img src="/images/products/men.webp" alt="محصولات ما" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useBrandsStore } from '@/stores/brands';

const brandsStore = useBrandsStore();
const brands = computed(() => brandsStore.brands);

onMounted(() => {
  brandsStore.fetchBrands();
});
</script>

<style scoped>
@import '@/assets/css/tailwind.css';

.image-container {
  @apply scale-350 md:scale-200 lg:scale-100 md:basis-1/2 relative translate-y-[60%] md:translate-y-[18%] z-4 pointer-events-none;
  @apply lg:translate-x-0;
}

.image-container img {
  @apply w-full h-full object-contain relative mix-blend-multiply;
}

.rounded-object {
  @apply aspect-square rounded-full;
  width: clamp(3rem, 20vw, 8rem);
  height: clamp(3rem, 20vw, 8rem);
}

@media (min-width: 1024px) {
  .rounded-object {
    width: clamp(18rem, 25vw, 25rem);
    height: clamp(18rem, 25vw, 25rem);
  }
}

.brands-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.brands-track {
  display: flex;
  gap: 2rem;
  width: fit-content;
  animation: infiniteScroll 20s linear infinite;
}

.brand-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Perfect seamless loop - no jump/flash */
@keyframes infiniteScroll {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(230%);
  }
}

/* Pause on hover for better UX */
.brands-track:hover {
  animation-play-state: paused;
}

/* Smooth performance optimizations */
.brands-track {
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>