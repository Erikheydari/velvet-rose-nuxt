<template>
  <TheButton variant="tonal" size="icon-lg" class="shrink-0 lg:hidden" :class="props.class"
    @click="toggleMenu">
    <Menu class="size-5" :class="props.iconClass" />
  </TheButton>
</template>

<script lang="ts" setup>
import { Menu } from 'lucide-vue-next'

const props = defineProps<{
  class?: string
  iconClass?: string
}>()

const emit = defineEmits(['toggle'])

const toggleMenu = () => {
  emit('toggle')
}
</script> 

<style></style>