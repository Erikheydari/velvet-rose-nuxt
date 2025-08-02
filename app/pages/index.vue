<template>
  <SectionsHomeHero />
  <SectionsHomeProducts :products="productsStore.products" type="default" title="محصولات آرایشی بهداشتی"
    description="تمامی محصولات کاملا اورجینال و از معتبر ترین برند های دنیا میباشند" />
</template>

<script lang="ts" setup>
import { useProductsStore } from '~/stores/products'

const productsStore = useProductsStore()

onMounted(async () => {
  await productsStore.fetchProducts()
})
</script>

<style></style>