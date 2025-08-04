<template>
  <SectionsHomeHero />


  <SectionsHomeProducts :products="productsStore.products" type="default">
    <SectionsHeading title="محصولات آرایشی بهداشتی"
      description="تمامی محصولات کاملا اورجینال و از معتبر ترین برند های دنیا میباشند" />
  </SectionsHomeProducts>


  <SectionsHomeCategory :category="categoriesStore.getCategoryBySlug('perfume-cologne') as Category">
    <SectionsHeading title="جایی که عطر، شخصیت می‌سازد" description="لوکس‌ترین عطرها، برای خاص‌ترین لحظه‌ها" />
  </SectionsHomeCategory>


  <SectionsHomeProducts :products="productsStore.products" type="secondary">
    <SectionsHeading title="محصولات آرایشی بهداشتی"
      description="تمامی محصولات کاملا اورجینال و از معتبر ترین برند های دنیا میباشند" />
  </SectionsHomeProducts>


  <SectionsHomeProductsByBrand :products="productsStore.products" title="Tom Ford" description="Product Model" />
</template>

<script lang="ts" setup>
import { useProductsStore } from '~/stores/products'
import { useCategoriesStore } from '~/stores/categories'
import type { Category } from '~/types/product.types'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

onMounted(async () => {
  await productsStore.fetchProducts()
  await categoriesStore.fetchCategories()
})
</script>

<style></style>s