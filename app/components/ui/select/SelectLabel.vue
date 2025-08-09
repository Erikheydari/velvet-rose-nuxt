<script setup lang="ts">
import type { SelectLabelProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { SelectLabel } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SelectLabelProps & { class?: HTMLAttributes["class"] }>()
</script>

<template>
  <SelectLabel
    data-slot="select-label"
    :class="cn('px-2 pt-1.5 pb-3 mb-2 text-sm font-medium text-end border-b border-b-border', props.class)"
  >
    <slot />
  </SelectLabel>
</template>
