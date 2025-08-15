<template>
  <div :class="cn('flex flex-col items-center justify-center text-center space-y-4', props.class)">
    <div class="relative w-fit">
      <Package class="size-12 text-muted-foreground/40" />
      <X class="size-5 absolute -bottom-1 -right-1 text-destructive" />
    </div>
    
    <div class="space-y-2">
      <h3 class="heading-6 font-semibold text-muted-foreground">
        {{ title }}
      </h3>
      <p class="body-2 text-muted-foreground max-w-md">
        {{ description }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 mt-6">
      <TheButton variant="default" to="/products">
        مشاهده همه محصولات
      </TheButton>
      <TheButton v-if="brandName" variant="outline" to="/brands">
        سایر برندها
      </TheButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Package, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  brandName?: string
  categoryName?: string
  searchQuery?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: ''
})

const title = computed(() => {
  if (props.searchQuery) {
    return 'نتیجه‌ای یافت نشد'
  }
  if (props.brandName) {
    return `محصولی از ${props.brandName} یافت نشد`
  }
  if (props.categoryName) {
    return `محصولی در ${props.categoryName} یافت نشد`
  }
  return 'محصولی یافت نشد'
})

const description = computed(() => {
  if (props.searchQuery) {
    return `متأسفانه محصولی با عبارت "${props.searchQuery}" پیدا نکردیم. لطفاً کلمات کلیدی دیگری امتحان کنید.`
  }
  if (props.brandName) {
    return `در حال حاضر محصولی از برند ${props.brandName} موجود نیست. از سایر برندها دیدن کنید.`
  }
  if (props.categoryName) {
    return `در حال حاضر محصولی در دسته‌بندی ${props.categoryName} موجود نیست.`
  }
  return 'در حال حاضر محصولی موجود نیست. به زودی محصولات جدید اضافه خواهد شد.'
})
</script>

<style scoped>

</style>
