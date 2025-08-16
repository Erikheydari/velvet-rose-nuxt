<template>
  <div class="default-inner-container default-padding-top default-margin-bottom">
    <ProductGrid :filterable="false" :loading="brandsStore.isLoading" :title="pageTitle">
      <!-- Products -->
      <ProductCard v-for="product in brandProducts" :key="product.id" :product="product" type="default" />
      <!-- Empty State -->
      <template v-if="!brandsStore.isLoading && brandProducts.length === 0">
        <div class="col-span-full">
          <ProductEmpty :brand-name="brandsStore.brand?.name" class="py-16" />
        </div>
      </template>
    </ProductGrid>
  </div>
</template>

<script lang="ts" setup>
import { useBrandsStore } from '~/stores/brands';

const route = useRoute();
const { slug } = route.params;

const brandsStore = useBrandsStore();

const brandProducts = computed(() => {
  return brandsStore.brandProducts || []
})

const pageTitle = computed(() => {
  if (brandsStore.brand?.name) {
    return `محصولات ${brandsStore.brand.name}`
  }
  return 'محصولات برند'
})

// Fetch logic
const fetchBrandProducts = async (slugParam: string) => {
  if (typeof slugParam === 'string' && slugParam) {
    await brandsStore.fetchBrandProductsBySlug(slugParam)
  }
}

// Watch for route changes
watch(
  () => route.params.slug,
  (newSlug, oldSlug) => {
    if (newSlug && newSlug !== oldSlug) {
      brandsStore.clearCurrentBrand()
      fetchBrandProducts(newSlug as string)
    }
  }
)

// Initial fetch
onMounted(() => {
  if (typeof slug === 'string' && slug) {
    fetchBrandProducts(slug)
  }
})

// SEO
useHead({
  title: pageTitle.value,
  meta: [
    {
      name: 'description',
      content: () => `مشاهده محصولات ${brandsStore.brand?.name || 'برند'} در فروشگاه آنلاین`
    }
  ]
})
</script>

<style></style>