<template>
  <div class="h-full 2xl:hero-height px-4 lg:px-12 relative default-padding-top default-margin-bottom">
    <section v-if="!productsStore.loading && productsStore.product"
      class="flex flex-col lg:flex-row justify-between w-full gap-6 h-full">
      <div class="order-2 xl:order-1 basis-full lg:basis-2/3 xl:basis-1/3 flex h-full flex-col xl:sticky xl:top-24 gap-8 lg:gap-10 xl:gap-8 xl:pt-10 ">
        <!-- Name -->
        <div class="w-full order-3 lg:order-1">
          <h1 class="heading-4 font-extrabold text-primary mb-2">
            {{ productsStore.product?.name }}
          </h1>

          <h2 class="heading-6 hidden xl:block leading-none capitalize">
            {{ productsStore.product?.full_name.toLowerCase() }}
          </h2>
        </div>

        <div class="block xl:hidden order-1 lg:order-2 xl:order-1">

          <ProductImage v-model="activeImageIndex" :images="allImages" :alt="productsStore.product?.name"
            :show-dots="true" :show-navigation="false" />

        </div>

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

        <ProductImageCarousel v-model="activeImageIndex" :images="allImages" :alt="productsStore.product?.name"
          :show-navigation="allImages.length > 3" class="order-2 xl:order-5" />
      </div>

      <div class="order-1 xl:order-2 basis-full lg:hidden xl:block xl:basis-2/3 ">
        <div class="bread-crumbs flex items-center gap-1 mb-4 w-full justify-center relative z-10 lg:hidden xl:flex">
          <TheButton variant="link" size="sm" class="shrink-0" :to="`/products`">
            محصولات
          </TheButton>
          <ChevronLeft class="size-3.5" />
          <TheButton variant="link" size="sm" :to="`/products/${productsStore.product?.category?.slug}`"
            class="shrink-0">
            {{ productsStore.product?.category?.name }}
          </TheButton>
          <ChevronLeft class="size-3.5" />
          <TheButton disabled variant="link" size="sm" class="shrink-0">
            <span class="md:block hidden">
              {{ productsStore.product?.name }}
            </span>
            <span class="md:hidden block">
              {{ productsStore.product?.name.slice(0, 5) }}...{{ productsStore.product?.name.slice(-5) }}
            </span>
          </TheButton>
        </div>


        <FantastyHeading v-if="productsStore.product?.brand?.name || productsStore.product?.brand?.en_name"
          class="lg:hidden xl:flex"
          :title="productsStore.product?.brand?.en_name?.toLowerCase().replaceAll('-', ' ') || productsStore.product?.brand?.name"
          :description="productsStore.product?.full_name.toLowerCase()"
          :to="`/brands/${productsStore.product?.brand?.slug}`"
          titleClass="heading-2 font-extrabold text-center lg:text-start leading-[80%]!"
          descriptionClass="heading-6 font-light! -mt-4 pb-2 max-w-[80%] mx-auto lg:mx-0 text-center leading-none capitalize" />

        <div class="hidden xl:block">
          <ProductImage v-model="activeImageIndex" :images="allImages" :alt="productsStore.product?.name"
            :show-dots="false" :show-navigation="true" />
        </div>

      </div>

      <div class="order-3 xl:order-3 basis-full lg:basis-1/3 lg:sticky xl:relative flex flex-col lg:top-24 h-fit gap-8 xl:pt-10"
        id="attributes-selection">

        <!-- Color Selection -->
        <div id="color-selection" v-if="productsStore.product?.attributes?.color?.length"
          class="color-selection flex gap-2 flex-col">
          <span class="w-full mb-2 heading-5 font-bold text-primary">انتخاب رنگ</span>
          <div class="flex flex-wrap gap-2">
            <TheButton v-for="color in productsStore.product.attributes.color" :key="color.id"
              class="color-selection-item-color hover:opacity-90 transition-opacity" variant="ghost" size="icon-lg"
              :style="{ backgroundColor: color.value }" @click="selectColor(color.id as string)">
              <Check class="size-4 mix-blend-difference text-background stroke-4"
                v-if="color.id === cartComposable.selectedColorId.value" />
            </TheButton>
          </div>
        </div>

        <!-- Size Selection -->
        <div id="size-selection" v-if="productsStore.product?.attributes?.size?.length"
          class="size-selection flex flex-col gap-2">
          <span class="w-full mb-2 heading-5 font-bold text-primary">انتخاب سایز</span>
          <div class="flex flex-wrap gap-2">
            <TheButton v-for="size in productsStore.product.attributes.size" :key="size.id" class="size-selection-item"
              :variant="size.id === cartComposable.selectedSizeId.value ? 'default' : 'outline'"
              :size="size.name?.length && size.name?.length < 3 ? 'icon-lg' : 'lg'"
              @click="selectSize(size.id as string)">
              <span class="-mt-0.5" :class="{ 'body-1': size.name?.length && size.name?.length < 3 }">{{ size.name
                }}</span>
            </TheButton>
          </div>
        </div>

        <!-- Price -->
        <div class="flex-col hidden xl:flex">
          <div class="flex items-center gap-2 mb-2 w-fit">
            <span class="w-full heading-5 font-bold text-primary">قیمت محصول</span>
          </div>

          <p v-if="productsStore.product?.discount_percentage > 0" class="-mb-1">
            <bdi class="text-muted-foreground line-through">
              {{ productsStore.product?.price }}
            </bdi>
            <span class="text-muted-foreground caption-2 ms-2">تومان</span>
          </p>

          <div class="heading-4 font-extrabold text-foreground flex items-baseline w-full">
            <bdi>
              {{ productsStore.product?.final_price }}
            </bdi>
            <span class="text-muted-foreground body-2 ms-2">تومان</span>

            <ProductDiscountPercentage v-if="productsStore.product?.discount_percentage > 0"
              :percentage="productsStore.product?.discount_percentage" class="ms-auto" />
          </div>

        </div>

        <div class="gap-2 lg:mb-0 mb-4 w-full hidden lg:flex flex-wrap">

          <!-- Quantity Selection -->
          <ProductCounter v-model="cartComposable.quantity.value" :max-quantity="productsStore.product?.qty || 1"
            class="mb-4" />

          <!-- Add to Cart Button -->
          <TheButton @click="cartComposable.handleAddToCart" class="px-6! lg:mb-0 mb-4 grow lg:grow-0 gap-4 " variant="default"
            size="lg" :class="{ 'opacity-50': !cartComposable.canAddToCart }">
            <ShoppingCart v-if="!cartStore.loading" class="size-4" />
            <span v-if="cartStore.loading">
              <Loader2 class="size-4 animate-spin" />
            </span>
            <span v-else class="body-1">افزودن به سبد خرید</span>
            <span v-if="cartStore.loading" class="body-1">در حال افزودن...</span>
          </TheButton>

        </div>
      </div>
    </section>

    <section v-else>
      <SkeletonProductPage />
    </section>

    <BottomNavigation v-if="!productsStore.loading && productsStore.product"
      class="flex justify-between flex-col sm:flex-row">

      <div class="flex items-center gap-2 grow justify-between">
        <div class="flex-col gap-2">

          <p v-if="productsStore.product?.discount_percentage > 0" class="text-muted-foreground">
            <bdi class="line-through">
              {{ productsStore.product.price }}
            </bdi>
            <span class="text-muted-foreground caption-2 ms-2">تومان</span>
          </p>

          <p class="heading-5 font-bold text-foreground">
            <bdi>
              {{ productsStore.product?.final_price }}
            </bdi>
            <span class="text-muted-foreground body-2 ms-2">تومان</span>
          </p>
        </div>

        <!-- Quantity Selection -->
        <ProductCounter v-model="cartComposable.quantity.value" :max-quantity="productsStore.product?.qty || 1"
          size="sm" class="w-fit!" />

      </div>

      <div class="gap-2 w-full sm:w-auto flex sm:flex-row justify-between sm:items-center">
        <!-- Add to Cart Button -->
        <TheButton @click="cartComposable.handleAddToCart" :disabled="cartStore.loadingAddToCart" size="sm"
          class="grow gap-4 sm:px-8!" variant="default" :class="{ 'opacity-80!': !cartComposable.canAddToCart }">
          <ShoppingCart v-if="!cartStore.loadingAddToCart" class="size-4" />
          <span v-if="cartStore.loadingAddToCart">
            <Loader2 class="size-4 animate-spin" />
          </span>
          <span v-else>افزودن به سبد</span>
        </TheButton>
        <CartTrigger v-if="cartComposable.hasItemsInCart" :handle-button-click="toggleCart" size="icon" />
      </div>
    </BottomNavigation>

    <!-- Cart Popover for Bottom Navigation -->
    <CartPopover :is-active="isCartOpen" :close-cart="() => isCartOpen = false" />
  </div>

  <section class="px-4 xl:px-12">
    <div class="flex flex-row w-full">
      <h4 class="heading-4 font-bold text-primary">
        محصولات مرتبط
      </h4>
    </div>
    <ProductCarousel :products="productsStore.getRandomProducts" type="default" :loading="false" :navigation="false"
      alignSlider="start" />
  </section>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useRoute } from 'vue-router'
import Original from '@/assets/icons/original.svg?component'
import { TheButton } from '#components'
import { Check, ChevronDown, ChevronLeft, Loader2, ShoppingCart } from 'lucide-vue-next'
import { FantastyHeading } from '~/components/ui/heading'
import ProductCounter from '~/components/product/counter/index.vue'
import { useCart } from '@/composables/useCart'
import { nextTick } from 'vue'

const config = useRuntimeConfig()
const mediaUrl = computed(() => config.public.mediaUrl)

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

// Use the cart composable
const cartComposable = useCart()

// Cart state for the popover
const isCartOpen = ref(false)

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const isSummaryExpanded = ref(false)

const productOptions = computed<string[]>(() => productsStore.product?.options ?? [])
const activeImageIndex = ref(0)

// Use composable selections and methods
const { selectedColorId, selectedSizeId, selectColor, selectSize, initializeSelections } = cartComposable

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

let fetchTimeout: NodeJS.Timeout | null = null
watch(
  () => route.params.slug,
  (newSlug, oldSlug) => {
    if (fetchTimeout) {
      clearTimeout(fetchTimeout)
    }

    if (typeof newSlug === 'string' && newSlug && newSlug !== oldSlug) {
      fetchTimeout = setTimeout(() => {
        productsStore.fetchProduct(newSlug)
        fetchTimeout = null
      }, 100)
    }
  }
)

useHead({
  title: () => {
    return productsStore.product?.name
  }
})

const allImages = computed(() => {
  if (!productsStore.product) return []

  const images: string[] = []

  // Add the default image first
  if (productsStore.product.image?.src) {
    images.push(productsStore.product.image.src)
  }

  // Add gallery images
  if (productsStore.product.gallery) {
    productsStore.product.gallery.forEach(img => {
      if (img.src) {
        // Check if it's a relative path that needs the media URL prefix
        const imageSrc = img.src.startsWith('http') ? img.src : mediaUrl.value + img.src
        images.push(imageSrc)
      }
    })
  }

  return images
})


onMounted(async () => {
  await productsStore.fetchProduct(route.params.slug as string)
  await productsStore.ensureProductsForRandom()
})

// Cleanup timeout on unmount
onBeforeUnmount(() => {
  if (fetchTimeout) {
    clearTimeout(fetchTimeout)
    fetchTimeout = null
  }
})



// Reset active image when product changes
watch(
  () => productsStore.product,
  (newProduct, oldProduct) => {
    // Only process if product actually changed and is valid
    if (newProduct && newProduct !== oldProduct) {
      nextTick(() => {
        initializeSelections()
        activeImageIndex.value = 0
      })
    }
  },
  { immediate: true }
)
</script>

<style></style>