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

      <template #pagination>
        <div v-if="meta && meta.last_page > 1" class="mt-6" dir="ltr">
          <Pagination
            :total="meta.total || 0"
            :items-per-page="meta.per_page || 12"
            :sibling-count="1"
            :page="meta.current_page || 1"
            @update:page="onPageChange"
          >
            <PaginationContent>
              <PaginationFirst />
              <PaginationPrevious />

              <template v-for="(item, index) in pageItems" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.page!"
                  :is-active="item.page === (meta?.current_page || 1)"
                >
                  {{ item.page }}
                </PaginationItem>
                <PaginationEllipsis v-else />
              </template>

              <PaginationNext />
              <PaginationLast />
            </PaginationContent>
          </Pagination>
        </div>
      </template>
    </ProductGrid>
  </div>
</template>

<script lang="ts" setup>
import { useProductsStore } from '@/stores/products';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationFirst, PaginationLast, PaginationEllipsis } from '@/components/ui/pagination';

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

// Build a simple page item model for current pagination window
const pageItems = computed(() => {
  const m: any = meta.value
  if (!m) return []
  const current = m.current_page || 1
  const last = m.last_page || 1
  const siblings = 1
  const pages: Array<{ type: 'page' | 'ellipsis'; page?: number }> = []

  const start = Math.max(1, current - siblings)
  const end = Math.min(last, current + siblings)

  // Always include first
  if (start > 1) {
    pages.push({ type: 'page', page: 1 })
    if (start > 2) pages.push({ type: 'ellipsis' })
  }

  for (let p = start; p <= end; p++) {
    pages.push({ type: 'page', page: p })
  }

  // Always include last
  if (end < last) {
    if (end < last - 1) pages.push({ type: 'ellipsis' })
    pages.push({ type: 'page', page: last })
  }

  return pages
})

const onPageChange = async (page: number) => {
  await productsStore.goToPage(page)
}
</script>

<style></style>