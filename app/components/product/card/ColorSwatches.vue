<template>
  <div class="flex -space-y-2" :class="props.orientation === 'horizontal' ? 'flex-row' : 'flex-col'" dir="ltr">
    <span v-for="(color, index) in props.colors" :key="index" :style="{ backgroundColor: color.value }"
      class="rounded-full border-2 border-background hover:scale-105 transition-transform duration-300"
      :class="sizeClass">
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  colors: {
    value: string
    name: string
  }[]
}>(), {
  size: 'md'
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-4 lg:size-5'
    case 'md':
      return 'size-5 lg:size-6'
    case 'lg':
      return 'size-6 lg:size-7'
  }
})
</script>