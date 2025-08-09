<template>
  <div class="h-full lg:hero-height lg:h-screen px-4 lg:px-12 pt-28">
    <center class="mb-8">
      <TheButton variant="outline" class="pr-7!" size="lg" @click="goBack">
        بازگشت
        <ChevronLeft />
      </TheButton>
    </center>

    <div v-if="!productsStore.isLoading && productsStore.product" class="flex flex-col lg:flex-row justify-between w-full gap-6 h-full">
      <div class="basis-full lg:basis-1/3 flex h-full flex-col lg:sticky lg:top-24 gap-8">
        <!-- Name -->
        <div class="w-full">
          <h1 class="heading-4 font-extrabold text-primary mb-2">
            {{ productsStore.product?.name }}
          </h1>

          <h2 class="heading-6">
            {{ productsStore.product?.full_name }}
          </h2>
        </div>

        <!-- Summary -->
        <div class="text-muted-foreground body-2 relative">
          <p class="line-clamp-6 transition-all duration-300" :class="{ 'line-clamp-none': isSummaryExpanded }">
            {{ productsStore.product?.summary }}
          </p>
          <TheButton
            v-if="productsStore.product?.summary && productsStore.product?.summary.length > 255"
            variant="ghost"
            size="icon"
            class="absolute bottom-0 left-0 z-10"
            @click="isSummaryExpanded = !isSummaryExpanded"
          >
            <ChevronDown class="size-4 transition-all duration-300" :class="{ 'rotate-180': isSummaryExpanded }" />
          </TheButton>
          <div
            v-if="!isSummaryExpanded && productsStore.product?.summary && productsStore.product?.summary.length > 255"
            class="bg-gradient-to-t from-background to-transparent absolute bottom-0 left-0 w-full h-1/2"
          ></div>
        </div>

        <!-- Options -->
        <ul v-if="productOptions.length > 0" class="mb-4">
          <li
            v-for="option in productOptions.slice(0, 3)"
            :key="option"
            class="body-2 text-primary list-inside list-disc"
          >
            {{ option }}
          </li>
          <li
            v-if="isOptionsExpanded"
            v-for="option in productOptions.slice(3)"
            :key="option"
            class="body-2 text-primary list-inside list-disc"
          >
            {{ option }}
          </li>
          <li v-if="productOptions.length > 3" class="body-2 text-primary">
            <TheButton variant="ghost" class="cursor-pointer py-0! mt-2" @click="isOptionsExpanded = !isOptionsExpanded">
              <Plus class="size-4" v-if="!isOptionsExpanded" />
              <Minus class="size-4" v-else />
              <span v-if="!isOptionsExpanded">
                {{ productOptions.length - 3 }}
                مورد دیگر
              </span>
              <span v-else>
                بستن
              </span>
            </TheButton>
          </li>
        </ul>

        <span
          v-if="productsStore.product?.original_tag"
          class="py-3 px-6 bg-secondary text-primary flex items-center gap-2 rounded-full justify-center w-fit mb-4"
        >
          <Original class="color-primary size-6" />
          این محصول اورجینال می‌باشد.
        </span>

        <div v-if="productsStore.product?.gallery" class="product-gallery flex gap-2 w-full grow">
          <TheCarousel :opts="{ loop: true, direction: 'rtl' }">
            <TheCarouselContent>
              <TheCarouselItem v-for="image, index in productsStore.product?.gallery" :key="image?.id || index" class="basis-full lg:basis-1/3">
                <img :src="mediaUrl + image.src" :alt="productsStore.product?.name" class="w-full h-full object-cover" />
              </TheCarouselItem>
            </TheCarouselContent>
          </TheCarousel>
        </div>
      </div>

      <div class="basis-full lg:basis-2/3">
        <FantastyHeading
          v-if="productsStore.product?.brand?.name || productsStore.product?.brand?.en_name"
          :title="productsStore.product?.brand?.en_name || productsStore.product?.brand?.name"
          :description="productsStore.product?.full_name"
          titleClass="heading-2 font-extrabold lg:h-[8vh]"
          descriptionClass="heading-4 font-light! mt-4 pb-2"
        />

        <figure class="w-full aspect-square h-auto max-w-[80%] md:max-w-[60%] mx-auto">
          <img :src="productsStore.product?.image?.src" :alt="productsStore.product?.name" class="w-full h-full object-contain" />
        </figure>
      </div>

      <div class="basis-full lg:basis-1/3 flex flex-col lg:sticky lg:top-24 h-fit lg:gap-8 gap-4">
        <!-- Color Selection -->
        <div v-if="productsStore.product?.attributes?.color?.length" class="color-selection flex gap-2 flex-col">
          <span class="w-full mb-2 heading-5 font-bold text-primary">انتخاب رنگ</span>
          <div class="flex flex-wrap gap-2">
            <TheButton
              v-for="color in productsStore.product.attributes.color"
              :key="color.id"
              class="color-selection-item-color hover:opacity-90 transition-opacity"
              variant="ghost"
              size="icon-lg"
              :style="{ backgroundColor: color.value }"
              @click="selectColor(color.id as string)"
            >
              <Check class="size-4 mix-blend-difference text-white stroke-4" v-if="color.id === selectedColorId" />
            </TheButton>
          </div>
        </div>

        <!-- Size Selection -->
        <div v-if="productsStore.product?.attributes?.size?.length" class="size-selection flex flex-col gap-2">
          <span class="w-full mb-2 heading-5 font-bold text-primary">انتخاب سایز</span>
          <div class="flex flex-wrap gap-2">
            <TheButton
              v-for="size in productsStore.product.attributes.size"
              :key="size.id"
              class="size-selection-item"
              :variant="size.id === selectedSizeId ? 'default' : 'outline'"
              :size="size.name?.length && size.name?.length < 3 ? 'icon-lg' : 'lg'"
              @click="selectSize(size.id as string)"
            >
              <span class="-mt-0.5" :class="{ 'body-1': size.name?.length && size.name?.length < 3 }">{{ size.name }}</span>
            </TheButton>
          </div>
        </div>

        <!-- Price -->
        <div class="flex flex-col gap-2">
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

        <div class="flex gap-2 mb-4 w-full">
          <!-- Add to Cart Button -->
          <TheButton @click="handleAddToCart" :disabled="!canAddToCart || cartStore.loading" class="px-8! mb-4 grow gap-4" variant="default" size="lg" :class="{ 'opacity-50': !canAddToCart }">
            <ShoppingCart v-if="!cartStore.loading" class="size-4" />
            <Loader2 class="size-4 animate-spin" v-if="cartStore.loading" />
            <span v-if="cartStore.loading">در حال افزودن...</span>
            <span v-else class="body-1">افزودن به سبد خرید</span>
          </TheButton>

          <!-- Quantity Selection -->
          <div class="quantity-selection flex items-center gap-2 mb-4">
            <TheButton variant="tonal" size="icon-lg" @click="decreaseQuantity" :disabled="quantity <= 1">
              <Minus class="size-4" />
            </TheButton>
            <span class="min-w-7 text-center body-1">{{ quantity }}</span>
            <TheButton variant="tonal" size="icon-lg" @click="increaseQuantity" :disabled="quantity >= (productsStore.product?.qty || 1)">
              <Plus class="size-4" />
            </TheButton>
          </div>
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
   </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useRoute, useRouter } from 'vue-router'
import Original from '@/assets/icons/original.svg?component'
import { TheButton } from '#components'
import { Check, ChevronDown, ChevronLeft, Loader2, Minus, Plus, ShoppingCart } from 'lucide-vue-next'
import { FantastyHeading } from '~/components/ui/heading'


const config = useRuntimeConfig()

const mediaUrl = computed(() => config.public.mediaUrl)

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const isSummaryExpanded = ref(false)
const isOptionsExpanded = ref(false)

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

// Back navigation
const goBack = () => {
  if (history.length > 1) {
    router.back()
  } else {
    router.push({ path: '/products' })
  }
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

const increaseQuantity = () => {
  if (quantity.value < (productsStore.product?.qty || 1)) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
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

// Add to cart handler
const handleAddToCart = async () => {
  if (!productsStore.product) return

  const hasColors = (productsStore.product.attributes?.color?.length ?? 0) > 0
  const hasSizes = (productsStore.product.attributes?.size?.length ?? 0) > 0

  if (hasColors && !selectedColorId.value) {
    validationMessage.value = 'لطفاً رنگ مورد نظر را انتخاب کنید'
    return
  }

  if (hasSizes && !selectedSizeId.value) {
    validationMessage.value = 'لطفاً سایز مورد نظر را انتخاب کنید'
    return
  }

  const attributes: string[] = []

  if (selectedColorId.value) {
    attributes.push(selectedColorId.value)
  }

  if (selectedSizeId.value) {
    attributes.push(selectedSizeId.value)
  }

  const cartItem = {
    product_id: productsStore.product.id,
    quantity: quantity.value,
    attributes: attributes,
  }

  try {
    await cartStore.addToCart(cartItem)

    validationMessage.value = ''
    console.log('Product added to cart successfully')
  } catch (error) {
    validationMessage.value = 'خطا در افزودن به سبد خرید'
    console.error('Add to cart error:', error)
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

onMounted(() => {
  productsStore.fetchProduct(route.params.slug as string)
})
</script>

<style></style>