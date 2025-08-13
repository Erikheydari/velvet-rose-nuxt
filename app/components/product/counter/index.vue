<template>
  <div class="quantity-selection flex items-center gap-2 w-full lg:w-fit justify-end lg:justify-start">
    <TheButton :variant="canDelete && quantity <= 1 ? 'tonalDestructive' : 'tonal'" :size="sureToDelete ? 'sm' : buttonSize"
      @click="canDelete && quantity <= 1 ? handleDelete() : decreaseQuantity()" :disabled="!canDelete && quantity <= 1"
      :class="sureToDelete ? 'py-0.5! h-8 px-2' : ''">

      <Trash2 v-if="canDelete && quantity <= 1 && !sureToDelete" class="size-4" />
      <small v-else-if="canDelete && quantity <= 1 && sureToDelete">
        حذف شود؟
      </small>
      <Minus v-else class="size-4" />
    </TheButton>
    <span class="min-w-7 text-center body-1">{{ quantity }}</span>
    <TheButton variant="tonal" :size="buttonSize" @click="increaseQuantity" :disabled="quantity >= maxQuantity">
      <Plus class="size-4" />
    </TheButton>
  </div>
</template>

<script lang="ts" setup>
import { TheButton } from '#components'
import { Plus, Minus, Trash2 } from 'lucide-vue-next'

interface Props {
  modelValue: number
  maxQuantity?: number
  minQuantity?: number
  canDelete?: boolean
  size?: 'sm' | 'default'
}

const props = withDefaults(defineProps<Props>(), {
  maxQuantity: 1,
  minQuantity: 1,
  canDelete: false,
  size: 'default'
})


const sureToDelete = ref(false)
const buttonSize = computed(() => props.size === 'sm' ? 'icon' : 'icon-lg')

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'delete': []
}>()

const quantity = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value)
})

const increaseQuantity = () => {
  sureToDelete.value = false
  if (quantity.value < props.maxQuantity) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > props.minQuantity) {
    quantity.value--
  }
}

const handleDelete = () => {
  if (sureToDelete.value) {
    emit('delete')
  } else {
    sureToDelete.value = true
  }
}
</script>

<style></style>