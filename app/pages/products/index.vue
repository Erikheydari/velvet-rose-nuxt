<template>
  <div>
    <SectionsProductsHero />
    <SectionsProductsBanners class="mb-8 lg:mb-12" />
    <ProductGrid class="mb-8 lg:mb-12" :loading="productsStore.loading">
      <ProductCard v-for="product in productsStore.products" :key="product.id" :product="product" type="default">
        <template #swatches>
          <ProductCardColorSwatches v-if="product.attributes.color && product.attributes.color.length > 0"
            :colors="product.attributes.color" class="absolute! top-4! right-4! z-2" orientation="vertical"
            size="md" />
        </template>
      </ProductCard>

      <template #empty>
        <ProductEmpty class="py-16" />
      </template>

      <template #pagination>
        <ProductPagination :meta="meta" @update:page="onPageChange" />
      </template>
    </ProductGrid>
  </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products';
import ProductPagination from '@/components/product/pagination/index.vue'

const productsStore = useProductsStore();

useHead({
  title: 'محصولات',
  meta: [
    { name: 'description', content: 'محصولات' }
  ]
})

onMounted(() => {
  productsStore.fetchProducts();
});

const meta = computed(() => productsStore.pagination?.meta)

const onPageChange = async (page: number) => {
  await productsStore.goToPage(page)
}
</script>

<style></style>