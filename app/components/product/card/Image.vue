<template>
  <div class="aspect-square w-full h-auto relative group max-w-[calc(100%-3.5rem)] mx-auto -translate-y-[10%]">
    <span v-if="props.image && !imageError && props.type !== 'secondary'"
      :class="{ 'animate-pulse': isImageLoading, 'bg-secondary': props.type === 'default', 'bg-primary': props.type === 'primary' }"
      class="group-hover:scale-103 transition-transform duration-300 rounded-full size-[80%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"></span>
    <figure v-if="props.image && !imageError">
      <img :src="props.image" :alt="props.alt || props.name || ''" @load="isImageLoading = false"
        @error="imageError = true"
        class="object-contain group-hover:scale-108 group-hover:rotate-2 transition-all duration-300 origin-center h-full w-full"
        :class="{ 'opacity-0': isImageLoading || imageError, 'opacity-100': !isImageLoading && !imageError }" />
      <span
        class="w-[90%] h-4 bg-muted-foreground/70  absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-3 rounded-[100%] blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></span>
    </figure>
    <span v-if="imageError" class="w-full h-full flex flex-col items-center justify-center gap-2">
      <ImageOff class="size-20 stroke-muted-foreground/20" />
      خطا در بارگزاری تصویر
    </span>
    <span v-if="!props.image" class="w-full h-full bg-muted-foreground animate-pulse flex items-center justify-center">
      تصویر وجود ندارد
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ImageOff } from 'lucide-vue-next';
const props = defineProps<{
  image?: string
  alt?: string
  name?: string
  type: 'default' | 'secondary' | 'primary'
}>()

const isImageLoading = ref(true)
const imageError = ref(false)

</script>

<style></style>