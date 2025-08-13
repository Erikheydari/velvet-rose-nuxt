<template>
  <ProductGrid v-if="brandsStore.brandProducts" :filterable="false" :loading="brandsStore.isLoading" class="default-inner-container default-padding-top default-margin-bottom"
    :title="brandsStore.brand?.name || 'محصولات برند'">
    <ProductCard v-for="product in brandsStore.brand?.products" :key="product.id" :product="product"
      type="default" />
  </ProductGrid>
</template>

<script lang="ts" setup>
import { useBrandsStore } from '~/stores/brands';

const route = useRoute();
const { slug } = route.params;

const brandsStore = useBrandsStore();

watch(
  () => route.params.slug,
  (newSlug) => {
    if (typeof newSlug === 'string' && newSlug) {
      brandsStore.fetchBrandProductsBySlug(newSlug)
    }
  }
)

onMounted(async () => {
  if (typeof slug === 'string' && slug) {
    await brandsStore.fetchBrandProductsBySlug(slug);
  }
});

const title = computed(() => {
  return brandsStore.brand?.name || 'محصولات برند'
})

useHead({
  title: title.value
})
</script>

<style></style>