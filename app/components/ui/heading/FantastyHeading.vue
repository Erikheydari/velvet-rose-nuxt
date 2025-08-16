<template>
  <div class="flex flex-col justify-center items-center relative lg:mb-20">
    <h3 
      class="relative z-0 leading-none uppercase" 
      :class="props.titleClass"
    >
      {{ props.title }}
    </h3>
    <p class="relative z-2 leading-none -mt-[2%] text-primary" :class="props.descriptionClass">
      {{ props.description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
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
h3 {
  background: linear-gradient(180deg, var(--color-primary) 0%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0) 140%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>