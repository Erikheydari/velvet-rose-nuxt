import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import type { CartItemAdd } from '~/types/cart.types'
import { toast } from 'vue-sonner'
import { useWindowSize } from '@vueuse/core'

export const useCart = () => {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  const productsStore = useProductsStore()
  const { width } = useWindowSize()

  // Selection states
  const selectedColorId = ref<string | null>(null)
  const selectedSizeId = ref<string | null>(null)
  const quantity = ref(1)
  const validationMessage = ref('')

  // Initialize default selections
  const initializeSelections = () => {
    selectedColorId.value = null
    selectedSizeId.value = null
    quantity.value = 1
    validationMessage.value = ''
  }

  // Selection methods
  const selectColor = (colorId: string) => {
    selectedColorId.value = colorId
    clearValidationMessage()
  }

  const selectSize = (sizeId: string) => {
    selectedSizeId.value = sizeId
    clearValidationMessage()
  }

  const clearValidationMessage = () => {
    validationMessage.value = ''
  }

  // Validation
  const canAddToCart = computed(() => {
    if (!productsStore.product) return false

    const hasColors = (productsStore.product.attributes?.color?.length ?? 0) > 0
    const hasSizes = (productsStore.product.attributes?.size?.length ?? 0) > 0

    if (hasColors && !selectedColorId.value) return false
    if (hasSizes && !selectedSizeId.value) return false

    return quantity.value > 0 && quantity.value <= (productsStore.product.qty || 0)
  })

  // Smoothly scroll to a section by id (with slight offset for mobile headers)
  const scrollToSection = (targetId: string, offset: number = 80) => {
    if (import.meta.client) {
      const target = document.getElementById(targetId)
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }
  }

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!productsStore.product) {
      scrollToSection('attributes-selection')
      toast.error('لطفاً ابتدا انتخاب رنگ و سایز مورد نظر را انجام دهید')
      return
    }

    if (!authStore.getTokenFromCookie()) {
      toast.error('لطفا ابتدا لاگین کنید!')
      return
    }

    const hasColors = (productsStore.product.attributes?.color?.length ?? 0) > 0
    const hasSizes = (productsStore.product.attributes?.size?.length ?? 0) > 0

    if (hasColors && !selectedColorId.value) {
      toast.error('لطفاً رنگ مورد نظر را انتخاب کنید')
      if (width.value < 1024) {
        scrollToSection('color-selection')
      }
      return
    }

    if (hasSizes && !selectedSizeId.value) {
      toast.error('لطفاً سایز مورد نظر را انتخاب کنید')
      if (width.value < 1024) {
        scrollToSection('size-selection')
      }
      return
    }

    const attributes: string[] = []

    if (selectedColorId.value) {
      attributes.push(selectedColorId.value)
    }

    if (selectedSizeId.value) {
      attributes.push(selectedSizeId.value)
    }

    const cartItem: CartItemAdd = {
      product_id: productsStore.product.id,
      quantity: quantity.value,
      attributes: attributes,
    }

    try {
      await cartStore.addToCart(cartItem)
      validationMessage.value = ''
      toast.success('محصول به سبد خرید اضافه شد')
    } catch (error) {
      validationMessage.value = 'خطا در افزودن به سبد خرید'
      const { getErrorMessage } = await import('~/lib/utils')
      console.error('Add to cart error:', getErrorMessage(error))
      toast.error('خطا در افزودن به سبد خرید')
    }
  }

  // Check if product has been added to cart (for showing cart trigger)
  const hasItemsInCart = computed(() => !cartStore.isCartEmpty)

  return {
    // State
    selectedColorId: readonly(selectedColorId),
    selectedSizeId: readonly(selectedSizeId),
    quantity,
    validationMessage: readonly(validationMessage),
    
    // Computed
    canAddToCart,
    hasItemsInCart,
    
    // Methods
    initializeSelections,
    selectColor,
    selectSize,
    clearValidationMessage,
    handleAddToCart,
    scrollToSection,
    
    // Store access
    cartStore,
    authStore,
    productsStore
  }
}
