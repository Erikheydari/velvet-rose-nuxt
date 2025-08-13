<template>
  <Teleport to="body">
    <div class="fixed bottom-0 left-0 w-full z-50 p-4 lg:hidden">
      <div class="background-backdrop bg-background/90! gap-4 p-4 rounded-lg"
        :class="props.class">
        
        <slot />

      </div>
    </div>

  </Teleport>
</template>

<script lang="ts" setup>

const props = defineProps<{
  class?: string
}>()

</script>

<style></style>