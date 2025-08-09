<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { NuxtLink } from '#components'

const props = defineProps<{
  class?: HTMLAttributes['class']
  to?: string
}>()

const componentIs = computed(() => {
  if (props.to) {
    return NuxtLink
  }
  return 'div'
})
</script>

<template>
  <component :is="componentIs" :to="props.to" data-slot="card" :class="cn(
    'bg-card text-card-foreground flex flex-col gap-2 rounded-4xl py-6',
    props.class,
  )
    ">
    <slot />
  </component>
</template>
