<template>
  <SectionsHomeHero />
  <SectionsHomeProducts :products="productsStore.products" type="default" title="محصولات آرایشی بهداشتی"
    description="تمامی محصولات کاملا اورجینال و از معتبر ترین برند های دنیا میباشند" />
  <SectionsHomeProducts :products="productsStore.products" type="secondary" title="محصولات آرایشی بهداشتی"
    description="تمامی محصولات کاملا اورجینال و از معتبر ترین برند های دنیا میباشند" />
  <section class="">
    <SectionsHomeProductsByBrand :products="productsStore.products" title="Tom Ford" description="Product Model" />
  </section>
</template>

<script lang="ts" setup>
import { useProductsStore } from '~/stores/products'

const productsStore = useProductsStore()

onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>

<style></style>s