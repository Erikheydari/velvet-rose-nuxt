<template>
  <Teleport to="body" :disabled="!shouldTeleport">
    <Transition enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-full md:translate-y-[-10px]"
      enter-to-class="opacity-100 transform translate-y-0" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-full md:translate-y-[-10px]">

      <div v-if="isActive" ref="cartContainerRef" :class="overlayClass" :style="isMobile ? panelStyle : {}" class="
          fixed flex flex-col lg:absolute
          bottom-0 lg:top-full right-0 w-full lg:w-md xl:w-lg
          z-55!
          background-backdrop-90
          p-4 lg:h-min rounded-t-2xl lg:rounded-2xl
          lg:max-h-[65vh] h-[80vh]
          overflow-hidden
          touch-none lg:touch-auto" @click="stopPropagation" v-bind="isMobile ? panelTouchHandlers : {}" dir="rtl">

        <!-- Mobile Handle Bar -->
        <div v-if="isMobile" class="
            flex justify-center items-center 
            absolute top-0 left-0 right-0 
            pt-3 pb-2
            cursor-grab active:cursor-grabbing
            touch-none
          " v-bind="handleBarTouchHandlers">
          <div class="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
        </div>

        <div class="flex justify-between items-center mb-4" :class="{ 'mt-4': isMobile }">
          <h6 class="heading-6 font-bold">سبد خرید</h6>
          <TheButton v-if="cartStore.cartItems.length > 0" variant="tonalDestructive" size="icon" @click="clearCart">
            <Trash2 class="size-4" />
            <span class="sr-only">پاک کردن سبد خرید</span>
          </TheButton>
        </div>

        <div v-if="cartStore.cartItems.length > 0"
          class="flex flex-col gap-4 overflow-y-auto lg:max-h-[50vh] grow border-y border-border py-4" @touchstart.stop
          @touchmove.stop @touchend.stop>
          <ProductCartCard v-for="item in cartStore.cartItems" :key="item.id" :product="item.product" :item-id="item.id"
            :quantity="item.quantity" orientation="horizontal" />
        </div>

        <div v-if="cartStore.cartItems.length > 0" class="flex justify-between lg:h-full items-end mt-4 w-full">
          <div class="caption-1 text-muted-foreground flex flex-col items-start">
            <p class="flex flex-row items-baseline">
              <span class="text-primary body-2 me-1">
                جمع کل
              </span>
              <span class="text-primary caption-2 me-4">({{ totalQuantity }})</span>
            </p>

            <span class="text-primary heading-6 font-bold">
              {{ formatPrice(totalPrice) }}
              <bdi class="text-primary caption-2">تومان</bdi>
            </span>
          </div>
          <TheButton v-if="cartStore.cartItems.length > 0" variant="default" class="w-fit" to="/checkout/cart">
            مشاهده سبد خرید
          </TheButton>
        </div>

        <template v-else>
          <CartEmpty class="h-full flex flex-col justify-center items-center gap-4" />
        </template>
      </div>
    </Transition>
  </Teleport>
  <Backdrop :is-active="isActive" :handle-close="handleClose" />
</template>

<script lang="ts" setup>
import { Trash2 } from 'lucide-vue-next';
import { ProductCartCard } from '#components';
import { useCartStore } from '~/stores/cart';
import Backdrop from '../ui/backdrop/Backdrop.vue';
import { useWindowSize } from '@vueuse/core';
import { useSlidePanel } from '@/composables/useSlidePanel';

const { width } = useWindowSize()

const cartStore = useCartStore()
const props = defineProps<{
  isActive: boolean
  closeCart: () => void
  overlayClass?: string
}>()

const router = useRouter()
const route = useRoute()
const cartContainerRef = ref<HTMLElement | null>(null)
const isUnmounting = ref(false)

const teleportTo = ref('body')

const isMobile = computed(() => width.value < 1024)

// Stable teleport flag that doesn't change after mount to prevent DOM errors
const shouldTeleport = ref(false)

// Use the slide panel composable for mobile only
const {
  panelStyle,
  panelTouchHandlers,
  handleBarTouchHandlers
} = useSlidePanel(
  computed(() => props.isActive && isMobile.value),
  {
    minHeight: 80,
    maxHeight: 100,
    closeThreshold: 30,
    snapThreshold: 10,
    onClose: () => props.closeCart()
  }
)

// Computed property to safely check if cart is mounted and active
const isCartMounted = computed(() => props.isActive && !!cartContainerRef.value && !isUnmounting.value)

const handleClose = () => {
  if (isUnmounting.value) return
  props.closeCart()
}

const handleClickOutside = (event: MouseEvent) => {
  // Additional safety checks to prevent errors during unmounting
  if (!isCartMounted.value) {
    return
  }

  // Check if the target is still valid and the component is mounted
  if (event.target && cartContainerRef.value && event.target instanceof Node && cartContainerRef.value.contains(event.target)) {
    return
  }

  handleClose()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isCartMounted.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    handleClose()
  }
}

const stopPropagation = (event: Event) => {
  event.stopPropagation()
}

// Lifecycle
onMounted(() => {
  // Set the stable teleport flag based on initial screen size
  // This prevents DOM manipulation errors from reactive changes
  shouldTeleport.value = width.value < 1024

  // Global event listeners
  document.addEventListener('click', handleClickOutside, { passive: true })
  document.addEventListener('keydown', handleKeyDown)
})

// Handle route changes
const removeRouterListener = router.afterEach((to, from) => {
  if (to.path !== from.path && !to.path.startsWith('/cart')) {
    if (props.isActive) {
      handleClose()
    }
  }
})

onBeforeUnmount(() => {
  // Set unmounting flag to prevent further operations
  isUnmounting.value = true

  // Clean up global event listeners
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)

  // Reset body overflow
  document.body.style.overflow = 'auto'

  // Clean up router listener
  removeRouterListener()
})

watch(() => props.isActive, (newVal) => {
  if (!import.meta.client) return
  if (newVal && isMobile.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

const clearCart = () => {
  cartStore.clearCart()
}

const formatPrice = (price: number) => {
  return price.toLocaleString('fa-IR');
}

const totalPrice = computed(() => {
  return cartStore.cartItems.reduce((acc, item) => acc + Number(item.product.final_price.replaceAll(/,/g, '')) * item.quantity, 0)
})

const totalQuantity = computed(() => {
  return cartStore.cartItems.reduce((acc, item) => acc + item.quantity, 0)
})
</script>