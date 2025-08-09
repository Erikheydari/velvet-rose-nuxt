<template>
  <div class="flex flex-col -space-y-2" dir="ltr">
    <span v-for="(color, index) in props.colors" :key="index" :style="{ backgroundColor: color.value }"
      class="size-6 rounded-full border border-background hover:scale-105 transition-transform duration-300">
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  colors: {
    value: string
    name: string
  }[]
}>();
</script>