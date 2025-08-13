<template>
  <div class="h-full 2xl:hero-height px-4 xl:px-12 pt-36 pb-24 relative">

    <div v-if="!productsStore.loading && productsStore.product"
      class="flex flex-col xl:flex-row justify-between w-full gap-6 h-full">
      <div class="order-2 xl:order-1 basis-full xl:basis-1/3 flex h-full flex-col xl:sticky xl:top-24 gap-8 ">
        <!-- Name -->
        <div class="w-full order-3 xl:order-1">
          <h1 class="heading-4 font-extrabold text-primary mb-2">
            {{ productsStore.product?.name }}
          </h1>

          <h2 class="heading-6 hidden xl:block leading-none capitalize">
            {{ productsStore.product?.full_name.toLowerCase() }}
          </h2>
        </div>

        <figure class="block xl:hidden w-full aspect-square h-auto max-w-[80%] md:max-w-[60%] mx-auto order-1">
          <img :src="productsStore.product?.image?.src" :alt="productsStore.product?.name"
            class="w-full h-full object-contain" />
        </figure>

        <!-- Summary -->
        <div class="text-muted-foreground body-2 relative order-4 xl:order-2">
          <p class="line-clamp-6 transition-all duration-300" :class="{ 'line-clamp-none': isSummaryExpanded }">
            {{ productsStore.product?.summary }}
          </p>
          <TheButton v-if="productsStore.product?.summary && productsStore.product?.summary.length > 255"
            variant="ghost" size="icon" class="absolute bottom-0 left-0 z-10"
            @click="isSummaryExpanded = !isSummaryExpanded">
            <ChevronDown class="size-4 transition-all duration-300" :class="{ 'rotate-180': isSummaryExpanded }" />
          </TheButton>
          <div
            v-if="!isSummaryExpanded && productsStore.product?.summary && productsStore.product?.summary.length > 255"
            class="bg-gradient-to-t from-background to-transparent absolute bottom-0 left-0 w-full h-1/2"></div>
        </div>

        <!-- Options -->
        <ProductOptions :options="productOptions" />

        <span v-if="productsStore.product?.original_tag"
          class="py-3 px-6 bg-secondary text-primary flex items-center gap-2 rounded-full justify-center w-fit mb-4 order-6 xl:order-4">
          <Original class="color-primary size-6" />
          این محصول اورجینال می‌باشد.
        </span>

        <div v-if="productsStore.product?.gallery" class="product-gallery flex gap-2 w-full grow order-2 xl:order-5">
          <TheCarousel :opts="{ loop: true, direction: 'rtl' }">
            <TheCarouselContent>
              <TheCarouselItem v-for="image, index in productsStore.product?.gallery" :key="image?.id || index"
                class="basis-1/3">
                <img :src="mediaUrl + image.src" :alt="productsStore.product?.name"
                  class="w-full h-full object-cover" />
              </TheCarouselItem>
            </TheCarouselContent>
          </TheCarousel>
        </div>
      </div>

      <div class="order-1 xl:order-2 basis-full xl:basis-2/3 ">
        <FantastyHeading v-if="productsStore.product?.brand?.name || productsStore.product?.brand?.en_name"
          :title="productsStore.product?.brand?.en_name || productsStore.product?.brand?.name"
          :description="productsStore.product?.full_name.toLowerCase()" titleClass="heading-2 font-extrabold h-[10vh]"
          descriptionClass="heading-5 font-light! -mt-4 lg:mt-4 pb-2 text-center lg:text-start leading-none capitalize" />

        <figure class="hidden xl:block w-full aspect-square h-auto max-w-[80%] md:max-w-[60%] mx-auto">
          <img :src="productsStore.product?.image?.src" :alt="productsStore.product?.name"
            class="w-full h-full object-contain" />
        </figure>
      </div>

      <div class="order-3 xl:order-3 basis-full xl:basis-1/3 flex flex-col xl:sticky xl:top-24 h-fit gap-8"
        id="attributes-selection">

        <!-- Color Selection -->
        <div id="color-selection" v-if="productsStore.product?.attributes?.color?.length"
          class="color-selection flex gap-2 flex-col">
          <span class="w-full mb-2 heading-5 font-bold text-primary">انتخاب رنگ</span>
          <div class="flex flex-wrap gap-2">
            <TheButton v-for="color in productsStore.product.attributes.color" :key="color.id"
              class="color-selection-item-color hover:opacity-90 transition-opacity" variant="ghost" size="icon-lg"
              :style="{ backgroundColor: color.value }" @click="selectColor(color.id as string)">
              <Check class="size-4 mix-blend-difference text-background stroke-4" v-if="color.id === selectedColorId" />
            </TheButton>
          </div>
        </div>

        <!-- Size Selection -->
        <div id="size-selection" v-if="productsStore.product?.attributes?.size?.length"
          class="size-selection flex flex-col gap-2">
          <span class="w-full mb-2 heading-5 font-bold text-primary">انتخاب سایز</span>
          <div class="flex flex-wrap gap-2">
            <TheButton v-for="size in productsStore.product.attributes.size" :key="size.id" class="size-selection-item"
              :variant="size.id === selectedSizeId ? 'default' : 'outline'"
              :size="size.name?.length && size.name?.length < 3 ? 'icon-lg' : 'lg'"
              @click="selectSize(size.id as string)">
              <span class="-mt-0.5" :class="{ 'body-1': size.name?.length && size.name?.length < 3 }">{{ size.name
              }}</span>
            </TheButton>
          </div>
        </div>

        <!-- Price -->
        <div class="flex-col gap-2 hidden xl:flex">
          <span class="w-full mb-2 heading-5 font-bold text-primary">قیمت محصول</span>
          <div class="flex gap-2 items-baseline">
            <p class="heading-4 font-extrabold text-foreground">
              <bdi>
                {{ productsStore.product?.final_price }}
              </bdi>
              <span class="text-muted-foreground body-2 ms-2">تومان</span>
            </p>
          </div>
        </div>

        <div class="gap-2 mb-4 w-full hidden lg:flex flex-wrap">

          <!-- Quantity Selection -->
          <ProductCounter v-model="quantity" :max-quantity="productsStore.product?.qty || 1" class="mb-4" />

          <!-- Add to Cart Button -->
          <TheButton @click="handleAddToCart" class="px-6! mb-4 grow gap-4 " variant="default" size="lg"
            :class="{ 'opacity-50': !canAddToCart }">
            <ShoppingCart v-if="!cartStore.loading" class="size-4" />
            <span v-if="cartStore.loading">
              <Loader2 class="size-4 animate-spin" />
            </span>
            <span v-else class="body-1">افزودن به سبد خرید</span>
            <span v-if="cartStore.loading" class="body-1">در حال افزودن...</span>
          </TheButton>

        </div>

        <!-- Validation Messages -->
        <div v-if="validationMessage" class="text-destructive text-sm mb-2">
          {{ validationMessage }}
        </div>
      </div>
    </div>

    <div v-else>
      <SkeletonProductPage />
    </div>

    <BottomNavigation class="flex justify-between flex-col sm:flex-row">
      <div class="flex-col gap-2">
        <div class="flex gap-2 items-baseline">
          <p class="heading-5 font-bold text-foreground">
            <bdi>
              {{ productsStore.product?.final_price }}
            </bdi>
            <span class="text-muted-foreground body-2 ms-2">تومان</span>
          </p>
        </div>
      </div>

      <div class="gap-2 flex-col w-full sm:w-auto flex sm:flex-row justify-between sm:items-center">

        <!-- Quantity Selection -->
        <ProductCounter v-model="quantity" :max-quantity="productsStore.product?.qty || 1" size="sm" />

        <!-- Add to Cart Button -->
        <TheButton @click="handleAddToCart" :disabled="cartStore.loading" class="grow gap-4 sm:px-8!" variant="default"
          :class="{ 'opacity-80!': !canAddToCart }">
          <ShoppingCart v-if="!cartStore.loading" class="size-4" />
          <span v-if="cartStore.loading">
            <Loader2 class="size-4 animate-spin" />
          </span>
          <span v-else>افزودن به سبد</span>
        </TheButton>

      </div>
    </BottomNavigation>
  </div>

  <div class="px-4 xl:px-12">
    <ProductCarousel :products="productsStore.getRandomProducts" type="default" :loading="false" navigation
      alignSlider="start" />
  </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useRoute } from 'vue-router'
import Original from '@/assets/icons/original.svg?component'
import { TheButton } from '#components'
import { Check, ChevronDown, Loader2, ShoppingCart } from 'lucide-vue-next'
import { FantastyHeading } from '~/components/ui/heading'
import ProductCounter from '~/components/product/counter/index.vue'
import type { CartItemAdd } from '~/types/cart.types'
import { toast } from 'vue-sonner'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const config = useRuntimeConfig()

const mediaUrl = computed(() => config.public.mediaUrl)

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const isSummaryExpanded = ref(false)

// Selection states
const selectedColorId = ref<string | null>(null)
const selectedSizeId = ref<string | null>(null)
const quantity = ref(1)
const validationMessage = ref('')

const productOptions = computed<string[]>(() => productsStore.product?.options ?? [])

// Initialize default selections when product loads
const initializeSelections = () => {
  selectedColorId.value = null
  selectedSizeId.value = null
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
  } catch (error) {
    validationMessage.value = 'خطا در افزودن به سبد خرید'
    const { getErrorMessage } = await import('~/lib/utils')
    console.error('Add to cart error:', getErrorMessage(error))
  }
}

// Watch for product changes to reinitialize selections
watch(
  () => productsStore.product,
  (newProduct) => {
    if (newProduct) {
      initializeSelections()
    }
  },
  { immediate: true }
)

// Watch for slug changes to refetch product on client-side navigation
watch(
  () => route.params.slug,
  (newSlug) => {
    if (typeof newSlug === 'string' && newSlug) {
      productsStore.fetchProduct(newSlug)
    }
  }
)

useHead({
  title: () => {
    return productsStore.product?.name
  }
})

onMounted(() => {
  productsStore.fetchProduct(route.params.slug as string)
})
</script>

<style></style>