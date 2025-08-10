<template>
  <TheCard class="transition-shadow hover:shadow-xs relative aspect-[328/455]" :to="`/product/${props.product.slug}`"
    :class="{ 'border border-border': props.type === 'primary', 'bg-transparent': props.type === 'secondary', 'border-border border': props.type === 'default' }">
    <div v-if="props.product.discount_percentage > 0"
      class=" absolute top-4 left-4 bg-primary text-primary-foreground rounded-full gap-0.5 size-12 flex items-center justify-center text-xl relatvie z-10">
      <span class="text-sm -mb-2">
        %
      </span>
      <span class="text-2xl">
        {{ props.product.discount_percentage }}
      </span>
    </div>


    <ProductCardColorSwatches v-if="props.product.attributes.color && props.product.attributes.color.length > 0"
      :colors="props.product.attributes.color" class="absolute top-4 right-4 z-1" />

    <ProductCardImage :image="props.product.image" :name="props.product.name" :type="props.type"
      class="relative size-full object-contain z-[1]" />

    <TheCardHeader class="relative z-1">
      <TheCardTitle class="text-primary line-clamp-2 font-bold">
        {{ props.product.name }}
      </TheCardTitle>
    </TheCardHeader>

    <TheCardContent class="space-y-4 relative z-1 grow">
      <p v-if="generateOptionsString" class="text-muted-foreground body-2 line-clamp-1">
        {{ generateOptionsString }}
      </p>
    </TheCardContent>

    <TheCardFooter class="relative z-1 justify-between items-end">
      <ProductCardPrice :product="props.product" />
    </TheCardFooter>
    <div v-if="props.type === 'secondary'"
      class="absolute top-0 left-0 w-full h-full bg-background secondary-card-mask z-0 ">
    </div>
  </TheCard>
</template>

<script lang="ts" setup>
import type { Product } from '~/types/product.types';

export type ProductCardType = 'default' | 'secondary' | 'primary'

const props = defineProps<{
  product: Product;
  type: ProductCardType;
}>();


const generateOptionsString = computed(() => {
  return props.product.options?.join(', ') || '';
});
</script>

<style scoped>
.secondary-card-mask {
  mask-size: 100% 100%;
  /* Stretches the mask to fill the container */
  mask-image: url("data:image/svg+xml,%3Csvg width='328' height='455' viewBox='0 0 328 455' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M299.5 0.0898438C314.964 0.0898438 327.5 12.6259 327.5 28.0898V426.09C327.5 441.554 314.964 454.09 299.5 454.09H28.5C13.036 454.09 0.5 441.554 0.5 426.09V28.0898C0.5 12.6259 13.036 0.0898444 28.5 0.0898438H53.3568C59.9427 0.0898438 64.721 6.36255 63.8379 12.889C63.2326 17.3625 62.9199 21.929 62.9199 26.5684C62.9201 82.3931 108.175 127.648 164 127.648C219.825 127.648 265.08 82.393 265.08 26.5684C265.08 21.929 264.767 17.3625 264.162 12.889C263.279 6.36254 268.057 0.0898438 274.643 0.0898438H299.5Z' fill='white'/%3E%3C/svg%3E%0A");
  mask-position: center;
  mask-repeat: no-repeat;
  mask-mode: alpha;
}
</style>