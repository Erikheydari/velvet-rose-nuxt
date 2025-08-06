<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { type ButtonVariants, buttonVariants } from '.'
import { NuxtLink } from "#components";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  to?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})

const componentTag = computed(() => (props.to ? NuxtLink : props.href ? 'a' : props.as))
</script>

<template>
  <Primitive :data-slot="props.to || props.href ? 'link' : 'button'" :as="componentTag" :as-child="asChild"
    :href="props.href" :to="props.to" :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </Primitive>
</template>