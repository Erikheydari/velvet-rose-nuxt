<template>
  <div class="h-screen flex flex-col justify-center items-center overflow-hidden">
    <slot />
    <NuxtLink :to="`/products/${props.category?.slug}`" class="w-[130vw] max-h-[50vh] lg:w-[50vw] lg:h-[70%] bg-image bg-background" :class="{ 'bg-image-loaded': isImageLoaded }">
      <img :src="props.category?.banner" alt="category banner"
        :class="{ 'opacity-100': isImageLoaded, 'opacity-0': !isImageLoaded }"
        class="w-full h-full max-w-[100vw] lg:max-w-[35vw] mx-auto object-cover lg:object-contain mix-blend-multiply transition-opacity duration-300"
        @load="handleImageLoad" />
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { NuxtLink } from '#components';
import type { Category } from '~/types/product.types';

const props = defineProps<{
  category: Category
}>()

const isImageLoaded = ref(false)

const handleImageLoad = () => {
  isImageLoaded.value = true
}
</script>

<style scoped>
.bg-image {
  background-image: url('/images/perfume.webp');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>