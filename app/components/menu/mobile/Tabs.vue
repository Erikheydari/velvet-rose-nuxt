<script setup lang="ts">
import { headerTabs } from '~/constants/headerNavItems'


const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const activeTab = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="border-b border-border">
    <div class="flex overflow-x-auto">
      <button v-for="tab in headerTabs" :key="tab.id" @click="activeTab = tab.id"
        class="flex items-center justify-center border-b-2 gap-2 px-4 py-3 heading-5 transition-all duration-200 whitespace-nowrap no-ring flex-1"
        :class="[
          activeTab === tab.id
            ? 'text-primary border-b-primary'
            : 'text-muted-foreground hover:text-foreground border-b-transparent'
        ]">
        <i :class="tab.icon" class="body-3" />
        <span>{{ tab.label }}</span>
        <i class="mdi mdi-chevron-down transition-all duration-300"
          :class="{ 'rotate-0': activeTab === tab.id, 'rotate-90': activeTab !== tab.id }" />
      </button>
    </div>
  </div>
</template>