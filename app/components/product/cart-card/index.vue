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
          <ColorSwatches v-if="props.product.attributes.color?.length > 0" size="sm"
            :colors="[props.product.attributes.color[0]!]" orientation="horizontal" />
          <span v-if="props.product.attributes.color?.length > 0" class="body-2 text-muted-foreground">
            {{ props.product.attributes.color[0]?.name }}
          </span>
          <span v-if="props.product.attributes.size?.length > 1">
            -
          </span>
          <span v-if="props.product.attributes.size?.length > 0" class="body-2 text-muted-foreground">
            سایز:‌
            <span class="body-2 font-bold">
              {{ props.product.attributes.size[0]?.name }}
            </span>
          </span>
        </div>
        <div class="flex gap-2 items-center justify-between w-full">
          <ProductCardPrice size="sm" :product="props.product" />
          <span class="body-2 text-muted-foreground">
            تعداد:‌
            {{ props.product.qty }}
          </span>
        </div>
      </div>
    </div>

    <TheButton variant="tonalDestructive" size="icon" @click="cartStore.removeFromCart(props.itemId)">
      <X class="size-4" />
    </TheButton>
  </div>
</template>

<script lang="ts" setup>
import { X } from 'lucide-vue-next';
import type { Product } from '~/types/product.types';
import ProductCardPrice from '@/components/product/card/Price.vue';
import ColorSwatches from '@/components/product/card/ColorSwatches.vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();


const props = defineProps<{
  product: Product
  itemId: number
}>()
</script>

<style></style>