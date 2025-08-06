<template>
  <section class="flex items-center justify-center hero-height">
    <div class="right-image image-container">
      <div class="bg-secondary size-80 absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full z-0">
      </div>
      <img src="/images/products/women.webp" alt="محصولات ما"
        class="w-full h-full object-cover z-1 relative mix-blend-multiply" />
    </div>


    <div
      class="flex flex-col items-center justify-center gap-4 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2">
      <h1 class="heading-2 text-primary font-extrabold">
        محصولات ما
      </h1>
      <p class="body-1">
        با کیفیت ترین محصولات از لوکس ترین برند های دنیا
      </p>
    </div>

    <div class="left-image image-container">
      <div class="bg-secondary size-80 absolute top-1/3 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full z-0">
      </div>
      <img src="/images/products/men.webp" alt="محصولات ما"
        class="w-full h-full object-contain z-1 relative mix-blend-multiply" />
    </div>

  </section>
</template>

<script lang="ts" setup>

</script>

<style scoped>
@import '@/assets/css/tailwind.css';

.image-container {
  @apply basis-1/2 relative bg-background translate-y-[10%];
}
</style>