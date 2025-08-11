<template>
  <TooltipProvider dir="ltr">
    <div class="flex -space-y-2 w-fit!" :class="props.orientation === 'horizontal' ? 'flex-row' : 'flex-col' + ' ' + props.class" >
      <Tooltip v-for="(color, index) in props.colors" :key="index">
        <TooltipTrigger as-child>
          <span :style="{ backgroundColor: color.value }"
            class="rounded-full border-2 border-background hover:scale-105 transition-transform duration-300"
            :class="sizeClass">
          </span>
        </TooltipTrigger>
        <TooltipContent class="z-55">
          <p :class="props.size === 'sm' ? 'caption-1' : 'body-2'">{{ color.name }}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
</template>

<script lang="ts" setup>
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  class?: string
  colors: {
    value: string
    name: string
  }[]
}>(), {
  size: 'md'
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-4 lg:size-5'
    case 'md':
      return 'size-5 lg:size-6'
    case 'lg':
      return 'size-6 lg:size-7'
  }
})
</script>