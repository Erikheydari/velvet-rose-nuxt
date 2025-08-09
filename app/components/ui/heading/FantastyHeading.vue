<template>
  <div class="flex flex-col justify-center items-center relative lg:mb-20">
    <h3 class="text-primary relative z-0 leading-none" :class="props.titleClass">
      {{ props.title }}
    </h3>
    <div class="background-gradient absolute left-0 bottom-0 w-full z-1"></div>
    <p class="relative z-2 leading-none -mt-[2%] text-primary" :class="props.descriptionClass">
      {{ props.description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
//with default values
const props = withDefaults(defineProps<{
  title: string;
  description: string;
  titleClass?: string;
  descriptionClass?: string;
}>(), {
  titleClass: 'heading-2 font-extrabold',
  descriptionClass: 'heading-3 font-light!'
});
</script>

<style scoped>
.background-gradient {
  height: clamp(5rem, 14vh, 12rem);
  background: var(--color-background);
  background: linear-gradient(0deg, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0.9) 40%, rgba(255, 255, 255, 0) 100%);
}
</style>