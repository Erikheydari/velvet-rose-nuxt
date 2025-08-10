<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="isActive" class="fixed inset-0 background-backdrop z-49" @click="handleClose" />
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps<{
  isActive: boolean
  handleClose: () => void
}>()

</script>

<style></style>