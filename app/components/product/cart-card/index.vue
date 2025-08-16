<template>
  <div :class="props.orientation === 'horizontal' ? 'flex-row' : 'flex-col lg:flex-row'"
    class="flex w-full rounded-2xl border border-border p-0 overflow-hidden relative min-h-38!"
    :to="`/product/${props.product.slug}`">
    <figure v-if="props.product.image"
      class="image-container aspect-square size-36 lg:size-38 h-auto bg-muted relative">
      <img :src="props.product.image.src" alt="product"
        class="object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full" />
    </figure>
    <div class="content flex flex-col gap-2 items-start py-2 lg:py-2 justify-between grow px-4">
      <h6 class="body-1 mb-2 font-medium!">{{ props.product.name }}</h6>
      <div class="flex flex-col gap-2 w-full items-start">
        <div class="flex gap-2 items-center w-full">
          <ColorSwatches v-if="colorSwatches.length > 0" size="sm" :colors="colorSwatches" orientation="horizontal" />
          <span v-if="selectedColorLabel" class="caption-1 text-muted-foreground">
            {{ selectedColorLabel }}
          </span>
          <span v-if="selectedSizeLabel">
            -
          </span>
          <span v-if="selectedSizeLabel" class="body-2 text-muted-foreground">
            سایز:‌
            <span class="caption-1 font-bold">
              {{ selectedSizeLabel }}
            </span>
          </span>
        </div>
        <div
          class="flex flex-col lg:flex-row gap-4 lg:gap-2 items-start lg:items-end justify-between w-full relative z-11">
          <ProductCardPrice size="sm" :product="props.product" />
          <ProductCounter 
            v-if="props.mode !== 'order'"
            v-model="quantity" 
            :max-quantity="99" 
            :min-quantity="1" 
            :can-delete="true" 
            size="sm"
            @delete="handleDelete" 
          />
          <div v-else class="text-sm text-muted-foreground">
            تعداد: {{ props.quantity }}
          </div>
        </div>
      </div>
    </div>
    <NuxtLink 
      v-if="props.mode !== 'order'"
      :to="`/product/${props.product.slug}`" 
      class="absolute top-0 left-0 w-full h-full z-10" 
    />
  </div>
</template>

<script lang="ts" setup>
import type { CartItem } from '~/types/cart.types';
import ProductCardPrice from '@/components/product/card/Price.vue';
import ColorSwatches from '@/components/product/card/ColorSwatches.vue';
import ProductCounter from '@/components/product/counter/index.vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const props = defineProps<{
  product: CartItem['product']
  itemId?: number
  quantity: number
  orientation?: 'horizontal' | 'vertical'
  mode?: 'cart' | 'order'
  orderItem?: any // For order-specific data structure
}>()

const selectedColor = computed(() => {
  if (props.mode === 'order' && props.orderItem?.attribute) {
    // For order items, get color from attribute array
    const colorAttr = props.orderItem.attribute.find((attr: any) => attr.color)
    return colorAttr ? { value: colorAttr.color, name: colorAttr.color } : null
  }
  // For cart items, use selected_attributes
  return props.product.selected_attributes?.find(a => a.attribute === 'color')
})

const selectedSize = computed(() => {
  if (props.mode === 'order' && props.orderItem?.attribute) {
    // For order items, get size from attribute array
    const sizeAttr = props.orderItem.attribute.find((attr: any) => attr.size)
    return sizeAttr ? { value: sizeAttr.size, name: sizeAttr.size } : null
  }
  // For cart items, use selected_attributes
  return props.product.selected_attributes?.find(a => a.attribute === 'size')
})

const colorSwatches = computed(() => selectedColor.value ? [{ value: selectedColor.value.name, name: selectedColor.value.value }] : [])
const selectedColorLabel = computed(() => selectedColor.value?.value || selectedColor.value?.name || '')
const selectedSizeLabel = computed(() => selectedSize.value?.value || selectedSize.value?.name || '')

const quantity = ref(props.quantity)

const handleDelete = () => {
  if (props.itemId) {
    cartStore.removeFromCart(props.itemId)
  }
}

// Watch for quantity changes to update cart - only for cart mode
watch(quantity, (newQuantity) => {
  if (props.mode !== 'order' && newQuantity !== props.quantity && props.itemId) {
    cartStore.updateCartItem(props.itemId, newQuantity)
  }
})
</script>

<style></style>