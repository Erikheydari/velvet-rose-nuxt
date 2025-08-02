<template>
  <div class="flex items-center justify-end -space-x-2 hover:w-full transition-all duration-300" dir="ltr">
    <span v-for="(color, index) in props.colors" :key="index" :style="{ backgroundColor: color }"
      class="size-8 rounded-full border border-background hover:scale-105 transition-transform duration-300">
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  colors: string[]
}>();
</script>