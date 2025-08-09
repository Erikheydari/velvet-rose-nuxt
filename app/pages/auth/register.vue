<script setup lang="ts">
import { useHead } from '#imports'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useHead({
  title: 'ثبت نام',
  meta: [
    { name: 'description', content: 'ثبت نام' }
  ]
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <h1 class="heading-5 font-bold text-primary text-center w-full">
      ثبت نام
    </h1>
    <FormRegister />
    <TheButton variant="ghost" size="lg" class="w-full absolute bottom-0 right-0 rounded-none" to="/auth/login">
      ورود به حساب
    </TheButton>
  </div>
</template>

<style scoped></style> 