<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <slot />
    <figure class="w-[50vw] h-[70%] bg-image bg-background" :class="{ 'bg-image-loaded': isImageLoaded }">
      <img :src="props.category?.banner" alt="category banner"
        :class="{ 'opacity-100': isImageLoaded, 'opacity-0': !isImageLoaded }"
        class="w-full h-full max-w-[35vw] mx-auto object-contain mix-blend-multiply transition-opacity duration-300"
        @load="handleImageLoad" />
    </figure>
  </div>
</template>

<script lang="ts" setup>
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