<template>
  <div class="flex flex-col gap-4 w-full">
    <h1 class="heading-5 font-bold text-primary text-center w-full">
      تایید کد
    </h1>
    <FormForgotPasswordOtp />
  </div>
</template>

<script lang="ts" setup>
import FormForgotPasswordOtp from '@/components/form/ForgotPasswordOtp.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

if (!authStore.isForgotPasswordOtpSent) {
  navigateTo('/auth/forgot-password')
}

definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useHead({
  title: 'تایید کد',
  meta: [
    { name: 'description', content: 'تایید کد' }
  ]
})
</script>

<style></style>