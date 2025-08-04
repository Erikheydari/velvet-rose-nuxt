<template>
  <TheButton :to="to" :href="href" :target="target"
    class="body-2 text-primary-foreground/70 hover:text-primary-foreground px-0 justify-start" variant="link">
    <slot />
  </TheButton>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  to?: string;
  href?: string;
  target?: string;
  class?: string;
}>(), {
  to: '',
});
</script>

<style></style>