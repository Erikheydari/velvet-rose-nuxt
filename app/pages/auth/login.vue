<script setup lang="ts">
import { useHead } from '#imports'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useHead({
  title: 'ورود به حساب کاربری',
  meta: [
    { name: 'description', content: 'ورود به حساب کاربری' }
  ]
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <h1 class="heading-5 font-bold text-primary text-center w-full">
      ورود به حساب کاربری
    </h1>
    <FormLogin />
    <TheButton variant="ghost" size="lg" class="w-full absolute bottom-0 right-0 rounded-none" to="/auth/register">
      ثبت نام
    </TheButton>
  </div>
</template>

<style scoped></style>