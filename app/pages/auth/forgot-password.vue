<script setup lang="ts">
import { useHead } from '#imports'

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useHead({
  title: 'فراموشی رمز عبور',
  meta: [
    { name: 'description', content: 'بازیابی رمز عبور' }
  ]
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <h1 class="heading-5 font-bold text-primary text-center w-full">
      بازیابی رمز عبور
    </h1>
    <FormForgotPassword />
  </div>
</template>

<style scoped></style> 