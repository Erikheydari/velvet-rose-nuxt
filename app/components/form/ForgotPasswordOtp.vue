<template>
  <form class="flex flex-col gap-3 w-full " @submit.prevent="handleSubmit">

    <TheInput v-model="emailValue" placeholder="ایمیل" class="h-12 w-full"
      :disabled="authStore.loading || !!authStore.forgotPasswordEmail" inputmode="email" />

    <div class="flex flex-row gap-3 w-full items-center relative">
      <TheInput v-model="passwordValue" placeholder="رمز عبور جدید" class="h-12 grow" :disabled="authStore.loading"
        :type="showPassword ? 'text' : 'password'" :aria-invalid="!isPasswordValid && passwordValue.length > 0" />
      <TheButton variant="ghost" size="sm" @click.prevent="showPassword = !showPassword"
        class="absolute top-1/2 -translate-y-1/2 end-2">
        <Eye v-if="showPassword" class="size-4" />
        <EyeOff v-else class="size-4" />
      </TheButton>
    </div>

    <TheInput v-model="otpValue" placeholder="کد یکبار مصرف" class="h-12"
      :aria-invalid="!isOtpValid && otpValue.length > 0" :disabled="authStore.loading" inputmode="numeric" />


    <TheButton type="submit" :disabled="!isFormValid || authStore.loading" size="lg" class="gradient-background"
      :loading="authStore.loading">
      <Loader2 v-if="authStore.loading" class="size-4 animate-spin" />
      <span v-if="isSubmitting">در حال تغییر رمز عبور...</span>
      <span v-else>تغییر رمز عبور</span>
    </TheButton>
    <TheButton to="/auth/forgot-password" size="lg" class="gradient-background" variant="ghost">
      <span>بازگشت</span>
    </TheButton>
  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { Loader2, Eye, EyeOff } from 'lucide-vue-next'

const authStore = useAuthStore()

const otpValue = ref('')
const isSubmitting = ref(false)
const showPassword = ref(false)
const passwordValue = ref('')

// Email value - use forgot password email if available, otherwise allow user input
const emailValue = computed({
  get: () => authStore.forgotPasswordEmail || '',
  set: (value: string) => {
    // Only allow setting if no forgot password email exists
    if (!authStore.forgotPasswordEmail) {
      // You might want to update the store here if needed
    }
  }
})

const isOtpValid = computed(() => {
  if (!otpValue.value) return false
  return otpValue.value.length === 6
})

const isPasswordValid = computed(() => {
  if (!passwordValue.value) return false
  return passwordValue.value.length >= 6
})

const isFormValid = computed(() => {
  return isOtpValid.value && isPasswordValid.value
})

// Watch for auth store errors
watch(() => authStore.error, (val) => {
  if (val) toast.error(val)
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('لطفا تمام فیلدها را به درستی پر کنید')
    return
  }

  isSubmitting.value = true
  const success = await authStore.resetPassword(
    emailValue.value,
    passwordValue.value,
    otpValue.value
  )

  if (success) {
    // Navigate to login page after successful password reset
    await navigateTo('/auth/login')
  }

  isSubmitting.value = false
}
</script>

<style></style>