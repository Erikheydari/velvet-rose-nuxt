<template>
  <TheButton variant="tonal" size="icon-lg" class="shrink-0 md:hidden" @click="toggleMenu">
    <Menu class="w-4 h-4" />
  </TheButton>
</template>

<script lang="ts" setup>
import { Menu } from 'lucide-vue-next'

const emit = defineEmits(['toggle'])

const toggleMenu = () => {
  emit('toggle')
}
</script> 

<style></style>