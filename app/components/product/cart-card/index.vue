<template>
  <div class="flex w-full rounded-2xl border border-border p-0">
    <figure v-if="props.product.image" class="image-container aspect-square lg:max-w-52 h-auto bg-muted relative">
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
        <div class="flex gap-2 items-end justify-between w-full">
          <ProductCardPrice size="sm" :product="props.product" />
          <ProductCounter v-model="quantity" :max-quantity="99" :min-quantity="1" :can-delete="true" size="sm"
            @delete="handleDelete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/product.types';
import ProductCardPrice from '@/components/product/card/Price.vue';
import ColorSwatches from '@/components/product/card/ColorSwatches.vue';
import ProductCounter from '@/components/product/counter/index.vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const props = defineProps<{
  product: Product
  itemId: number
  quantity: number
}>()

const selectedColor = computed(() => props.product.selected_attributes?.find(a => a.attribute === 'color'))
const selectedSize = computed(() => props.product.selected_attributes?.find(a => a.attribute === 'size'))

const colorSwatches = computed(() => selectedColor.value ? [{ value: selectedColor.value.name, name: selectedColor.value.value }] : [])
const selectedColorLabel = computed(() => selectedColor.value?.value || '')
const selectedSizeLabel = computed(() => selectedSize.value?.value || '')

const quantity = ref(props.quantity)

const handleDelete = () => {
  cartStore.removeFromCart(props.itemId)
}

// Watch for quantity changes to update cart
watch(quantity, (newQuantity) => {
  if (newQuantity !== props.quantity) {
    cartStore.updateCartItem(props.itemId, newQuantity)
  }
})
</script>

<style></style>