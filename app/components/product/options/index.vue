<template>
  <ul v-if="options.length > 0" class="mb-4 order-5 xl:order-3">
    <li v-for="option in options.slice(0, 3)" :key="option" class="body-2 text-primary list-inside list-disc">
      {{ option }}
    </li>
    <li v-if="isOptionsExpanded" v-for="option in options.slice(3)" :key="option"
      class="body-2 text-primary list-inside list-disc">
      {{ option }}
    </li>
    <li v-if="options.length > 3" class="body-2 text-primary">
      <TheButton variant="ghost" class="cursor-pointer py-0! mt-2" @click="isOptionsExpanded = !isOptionsExpanded">
        <Plus class="size-4" v-if="!isOptionsExpanded" />
        <Minus class="size-4" v-else />
        <span v-if="!isOptionsExpanded">
          {{ options.length - 3 }}
          مورد دیگر
        </span>
        <span v-else>
          بستن
        </span>
      </TheButton>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { TheButton } from '#components'
import { Plus, Minus } from 'lucide-vue-next'

interface Props {
  options: string[]
}

const props = defineProps<Props>()

const isOptionsExpanded = ref(false)
</script>

<style></style>