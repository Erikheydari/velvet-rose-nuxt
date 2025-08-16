<template>
  <div v-if="images.length > 1" class="product-gallery flex gap-2 sm:max-w-[80%] w-full grow mx-auto lg:mx-0">
    <TheCarousel 
      :opts="{ 
        loop: true, 
        direction: 'rtl',
        align: 'start',
        slidesToScroll: 1
      }"
      @init-api="handleInitApi"
      class="w-full"
    >
      <TheCarouselContent class="-ml-3 px-1!">
        <TheCarouselItem 
          v-for="(image, index) in images" 
          :key="`gallery-${index}`"
          class="pl-3 basis-1/3 md:basis-1/4 lg:basis-1/3 cursor-pointer py-2"
          @click="selectImage(index)"
        >
          <div class="relative group">
            <figure 
              class="aspect-square rounded-md overflow-hidden"
              :class="{ 
                'ring-2 ring-primary': modelValue === index
              }"
            >
              <img 
                :src="image" 
                :alt="`${alt} - ${index + 1}`"
                class="w-full h-full object-cover transition-all duration-200"
                :class="{ 
                  'opacity-60 group-hover:opacity-100': modelValue !== index,
                  'scale-105': modelValue === index
                }"
              />
            </figure>
          </div>
        </TheCarouselItem>
      </TheCarouselContent>
    </TheCarousel>
  </div>
</template>

<script lang="ts" setup>
import type { CarouselApi } from '@/components/ui/carousel'

interface Props {
  images: string[]
  modelValue: number
  alt?: string
  showNavigation?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  alt: 'Product image',
  showNavigation: true
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

const selectImage = (index: number) => {
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

// Auto-scroll gallery to show active thumbnail
watch(() => props.modelValue, (newIndex) => {
  if (emblaApi.value) {
    const slidesInView = emblaApi.value.slidesInView()
    if (!slidesInView.includes(newIndex)) {
      emblaApi.value.scrollTo(newIndex)
    }
  }
})
</script>