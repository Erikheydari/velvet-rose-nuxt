<template>
  <div class="flex -space-y-2" :class="props.orientation === 'horizontal' ? 'flex-row' : 'flex-col'" dir="ltr">
    <span v-for="(color, index) in props.colors" :key="index" :style="{ backgroundColor: color.value }"
      class="size-6 rounded-full border border-background hover:scale-105 transition-transform duration-300">
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  orientation?: 'horizontal' | 'vertical'
  colors: {
    value: string
    name: string
  }[]
}>();
</script>