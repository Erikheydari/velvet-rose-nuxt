<template>
  <Transition enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform translate-y-full md:translate-y-[-10px]"
    enter-to-class="opacity-100 transform translate-y-0" leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-full md:translate-y-[-10px]">
    <div v-if="isActive" ref="cartContainerRef" :class="overlayClass" class="
        absolute
        top-full right-0 w-full lg:w-md xl:w-lg
        z-51
        background-backdrop-90
        p-4 h-min rounded-2xl
        max-h-[65vh]
        overflow-hidden
      " @click="stopPropagation" dir="rtl">
      <div class="flex justify-between items-center mb-4">
        <h6 class="heading-6 font-bold">سبد خرید</h6>
        <TheButton v-if="cartStore.cartItems.length > 0" variant="tonalDestructive" size="icon" @click="clearCart">
          <Trash2 class="size-4" />
          <span class="sr-only">پاک کردن سبد خرید</span>
        </TheButton>
      </div>

      <div v-if="cartStore.cartItems.length > 0" class="flex flex-col gap-4 overflow-y-auto max-h-[50vh] border-y border-border py-4">
        <ProductCartCard v-for="item in cartStore.cartItems" :key="item.id" :product="item.product" :item-id="item.id"
          :quantity="item.quantity" />
      </div>
      <div v-if="cartStore.cartItems.length > 0" class="flex justify-between h-full items-end mt-4 w-full">
        <p class="caption-1 text-muted-foreground flex flex-row items-baseline">
          <span class="text-primary body-2 me-1">
            جمع کل
          </span>
          <span class="text-primary caption-2 me-4">({{ totalQuantity }})</span>
          <span class="text-primary heading-6 font-bold">
            {{ formatPrice(totalPrice) }}
          </span>
        </p>
        <TheButton v-if="cartStore.cartItems.length > 0" variant="default" class="w-fit" to="/checkout/cart">
          مشاهده سبد خرید
        </TheButton>
      </div>

      <div v-else class="flex flex-col gap-4 py-10">
        <div class="relative w-fit mx-auto">
          <ShoppingCart class="size-10 mx-auto overflow-visible text-muted-foreground/40" />
          <X class="size-4 mx-auto overflow-visible absolute bottom-1/2 left-10/12 text-destructive z-10" />
        </div>
        <p class="body-2 text-muted-foreground mx-auto">
          سبد خرید شما خالی است
        </p>
        <TheButton v-if="route.path !== '/products'" variant="tonal" size="sm" class="w-fit mx-auto" to="/products">
          فروشگاه
        </TheButton>
      </div>
    </div>
  </Transition>
  <Backdrop :is-active="isActive" :handle-close="handleClose" />
</template>

<script lang="ts" setup>
import { Trash2, ShoppingCart, X } from 'lucide-vue-next';
import { ProductCartCard } from '#components';
import { useCartStore } from '~/stores/cart';
import Backdrop from '../ui/backdrop/Backdrop.vue';

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
  if (newVal) {
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

<style></style>