<template>
  <div class="default-inner-container">
    <h3 v-if="props.title" class="heading-3 text-primary text-center mb-4">
      {{ props.title }}
    </h3>
    <p v-if="props.description" class="text-center text-muted-foreground mb-12 text-lg">
      {{ props.description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
  description: string
}>()

</script>

<style></style>