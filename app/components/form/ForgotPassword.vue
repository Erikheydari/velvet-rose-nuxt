<template>
  <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit">
    <TheInput v-model="emailValue" placeholder="ایمیل" class="h-12"
      :aria-invalid="!isEmailValid && emailValue.length > 0" :disabled="authStore.loading" inputmode="email" />

    <TheButton type="submit" :disabled="!isEmailValid || authStore.loading || emailValue.length === 0" size="lg"
      class="gradient-background" :loading="authStore.loading">
      <Loader2 v-if="authStore.loading" class="size-4 animate-spin" />
      <span v-if="isSubmitting">در حال ارسال...</span>
      <span v-else>ارسال لینک بازیابی</span>
    </TheButton>
  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()

const emailValue = ref('')
const isSubmitting = ref(false)

const isEmailValid = computed(() => {
  if (!emailValue.value) return false
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(emailValue.value)
})

watch(() => authStore.error, (val) => {
  if (val) toast.error(val)
})

const handleSubmit = async () => {
  if (!isEmailValid.value) {
    toast.error('ایمیل معتبر نیست')
    return
  }

  isSubmitting.value = true
  await authStore.requestPasswordReset(emailValue.value)
  isSubmitting.value = false
  navigateTo('/auth/forgot-password/otp')
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(266deg, #3624CB 8.21%, #1B1265 94.07%);
}
</style>