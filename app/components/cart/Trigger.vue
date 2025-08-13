<script lang="ts" setup>
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  handleButtonClick: () => void
}>()

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.cartItemsCount)

const isBuzzing = ref(false)
let buzzTimeout: ReturnType<typeof setTimeout> | null = null

const startBuzz = () => {
  if (buzzTimeout) clearTimeout(buzzTimeout)
  isBuzzing.value = true
  buzzTimeout = setTimeout(() => {
    isBuzzing.value = false
    buzzTimeout = null
  }, 900)
}

watch(
  () => cartCount.value,
  (newVal, oldVal) => {
    if (typeof oldVal === 'number' && newVal > oldVal) {
      startBuzz()
    }
  },
  { immediate: false }
)

watch(
  () => cartStore.justAdded,
  (flag) => {
    if (flag) startBuzz()
  }
)

const handleTriggerClick = (event: MouseEvent | KeyboardEvent) => {
  event.preventDefault()
  event.stopPropagation()
  props.handleButtonClick()
}
</script>

<template>
  <TheButton
    variant="tonal"
    size="icon-lg"
    class="relative"
    :class="{ buzzing: isBuzzing }"
    @click="handleTriggerClick"
    aria-label="سبد خرید"
  >
    <ShoppingCart class="size-5" />

    <span
      v-if="cartCount > 0"
      class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs leading-none flex items-center justify-center shadow-sm"
    >
      {{ cartCount }}
    </span>
  </TheButton>
</template>

<style></style>