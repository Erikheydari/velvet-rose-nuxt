<template>
  <section class="default-padding-top default-margin-bottom lg-inner-container default-padding-x">
    <Transition name="fade" mode="out-in">
      <div class="flex items-baseline gap-2 w-full sm:w-auto mb-6 z-0">
        <h1 class="heading-5 font-bold">برندها</h1>
      </div>
    </Transition>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <TheCard v-for="brand in brandsStore.brands" :key="brand.id" :to="`/brands/${brand.slug}`"
        class="flex flex-col gap-2 items-center justify-center border border-border rounded-lg p-4">
        <figure class="w-full h-40 rounded-lg">
          <img :src="brand.banner" :alt="brand.name" class="w-full h-full object-contain rounded-lg">
        </figure>
        <h2 class="heading-6 font-bold">
          {{ brand.name }}
        </h2>
      </TheCard>
    </div>
  </section>

  <div class="flex flex-col gap-8 lg:gap-12 lg-inner-container default-padding-x">
    <template v-for="brand in brandsStore.brands" :key="brand.id">
      <div v-if="brand.slug && isBrandHasProducts(brand.slug)">
        <h2 class="heading-4 font-bold w-full">
          برخی از محصولات برند
          {{ brand.name }}
        </h2>

        <ProductCarouselByBrand :brand-slug="brand.slug" align-slider="start" :max-items="6" type="default" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useBrandsStore } from '~/stores/brands';

const brandsStore = useBrandsStore();

const isBrandHasProducts = (brandSlug: string) => {
  return brandsStore.getBrandProducts(brandSlug).length > 0;
}

onMounted(async () => {
  await brandsStore.fetchBrands();
  await brandsStore.fetchAllBrandProducts();
});

const title = computed(() => {
  return 'برندها';
})

useHead({
  title: title.value
})
</script>

<style></style>