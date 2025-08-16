<template>
  <div class="w-full aspect-square h-auto max-w-[80%] md:max-w-[60%] mx-auto">
    <TheCarousel :opts="{
      loop: true,
      direction: 'rtl',
      align: 'center',
      containScroll: 'trimSnaps'
    }" @init-api="handleInitApi" class="w-full h-full">
      <TheCarouselContent class="h-full">
        <TheCarouselItem v-for="(image, index) in images" :key="`main-${index}`" class="h-full">
          <figure class="w-full h-full flex items-center justify-center">
            <img :src="image" :alt="`${alt} - ${index + 1}`" class="w-full h-full object-contain" />
          </figure>
        </TheCarouselItem>
      </TheCarouselContent>
    </TheCarousel>

    <!-- Optional: Add dots indicator -->
    <div v-if="showDots && images.length > 1" class="flex justify-center gap-1 mt-4">
      <button v-for="(_, index) in images" :key="`dot-${index}`" @click="goToSlide(index)"
        class="w-2 h-2 rounded-full transition-all"
        :class="modelValue === index ? 'bg-primary w-6' : 'bg-muted-foreground/30'"
        :aria-label="`Go to image ${index + 1}`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselApi } from '@/components/ui/carousel'

interface Props {
  images: string[]
  modelValue: number
  alt?: string
  showNavigation?: boolean
  showDots?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  alt: 'Product image',
  showNavigation: true,
  showDots: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const emblaApi = ref<CarouselApi>()

const handleInitApi = (api: CarouselApi) => {
  emblaApi.value = api

  // Set initial position
  if (props.modelValue !== 0) {
    api?.scrollTo(props.modelValue, false)
  }

  // Listen for carousel selection changes
  api?.on('select', () => {
    const newIndex = api.selectedScrollSnap()
    if (newIndex !== props.modelValue) {
      emit('update:modelValue', newIndex)
    }
  })
}

const goToSlide = (index: number) => {
  emit('update:modelValue', index)
  if (emblaApi.value) {
    emblaApi.value.scrollTo(index)
  }
}

// Sync carousel position when modelValue changes externally
watch(() => props.modelValue, (newIndex) => {
  if (emblaApi.value && emblaApi.value.selectedScrollSnap() !== newIndex) {
    emblaApi.value.scrollTo(newIndex)
  }
})
</script>