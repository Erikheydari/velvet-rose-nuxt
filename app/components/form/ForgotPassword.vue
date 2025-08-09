<template>
  <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit">
    <TheInput
      v-model="emailValue"
      placeholder="ایمیل"
      class="h-12"
      :aria-invalid="!isEmailValid && emailValue.length > 0"
      :disabled="cartStore.loading"
      inputmode="email"
    />

    <TheButton
      type="submit"
      :disabled="!isEmailValid || cartStore.loading"
      size="lg"
      class="gradient-background"
      :loading="cartStore.loading"
    >
      ارسال لینک بازیابی
    </TheButton>
  </form>
</template>

<script lang="ts" setup>
import { useCartStore } from '@/stores/cart'
import { toast } from 'vue-sonner'

const cartStore = useCartStore()

const emailValue = ref('')

const isEmailValid = computed(() => {
  if (!emailValue.value) return false
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(emailValue.value)
})

watch(() => cartStore.error, (val) => {
  if (val) toast.error(val)
})

const handleSubmit = async () => {
  if (!isEmailValid.value) return
  const { error } = await cartStore.requestPasswordReset(emailValue.value)
  if (!error) {
    toast.success('در صورت وجود حساب، لینک بازیابی ارسال شد')
    await navigateTo('/auth/login')
  }
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(266deg, #3624CB 8.21%, #1B1265 94.07%);
}
</style> 