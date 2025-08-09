<template>
  <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit">

    <!-- Register fields -->
    <TheInput
      v-if="isRegister && !authStore.awaitingOtp"
      v-model="nameValue"
      placeholder="نام نمایشی"
      class="h-12"
      :disabled="authStore.loading"
    />

    <!-- Email field -->
    <TheInput
      v-if="!authStore.awaitingOtp"
      v-model="emailValue"
      placeholder="ایمیل"
      class="h-12"
      :aria-invalid="!isEmailValid && emailValue.length > 0"
      :disabled="authStore.loading"
      inputmode="email"
    />

    <!-- Password field + reveal -->
    <div v-if="(isRegister || isPassword) && !authStore.awaitingOtp" class="flex flex-row gap-3 w-full items-center relative">
      <TheInput
        v-model="passwordValue"
        placeholder="رمز عبور"
        class="h-12 grow"
        :disabled="authStore.loading"
        :type="showPassword ? 'text' : 'password'"
      />
      <TheButton variant="ghost" size="sm" @click.prevent="showPassword = !showPassword" class="absolute top-1/2 -translate-y-1/2 end-2">
        <Eye v-if="showPassword" class="size-4" />
        <EyeOff v-else class="size-4" />
      </TheButton>
    </div>

    <!-- OTP field -->
    <div v-if="authStore.awaitingOtp" class="flex flex-col gap-2">
      <p class="text-sm text-muted-foreground">کد تایید به ایمیل شما ارسال شد.</p>
      <TheInput
        v-model="otpValue"
        placeholder="کد تایید"
        class="h-12"
        :disabled="authStore.loading"
        inputmode="numeric"
      />
    </div>

    <!-- Error Display -->
    <div v-if="authStore.error" class="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
      <p class="text-destructive text-sm">{{ authStore.error }}</p>
    </div>

    <!-- Submit Buttons -->
    <TheButton
      v-if="!isRegister && !authStore.awaitingOtp"
      type="submit"
      :disabled="!canSubmitLogin || authStore.loading"
      size="lg"
      class="gradient-background"
      :loading="authStore.loading"
    >
      <span v-if="authStore.loading">در حال ورود...</span>
      <span v-else>ورود به حساب</span>
    </TheButton>

    <TheButton
      v-if="isRegister && !authStore.awaitingOtp"
      type="submit"
      :disabled="!canSubmitRegister || authStore.loading"
      class="gradient-background"
      size="lg"
      :loading="authStore.loading"
    >
      ارسال کد
    </TheButton>

    <TheButton
      v-if="authStore.awaitingOtp"
      type="submit"
      :disabled="!otpValue || authStore.loading"
      class="gradient-background"
      size="lg"
      :loading="authStore.loading"
    >
      تایید کد
    </TheButton>

    <!-- Toggles -->
    <div v-if="!authStore.awaitingOtp" class="flex flex-row gap-3 justify-between">
      <TheButton variant="ghost" size="sm" @click.prevent="toggleRegister">
        {{ isRegister ? 'ورود به حساب' : 'ثبت نام' }}
      </TheButton>
      <TheButton variant="ghost" size="sm" @click.prevent="isPassword = !isPassword">
        {{ isPassword ? 'ورود با کد یکبار مصرف' : 'ورود با رمز عبور' }}
      </TheButton>
      <TheButton v-if="isPassword" variant="ghost" size="sm">رمز خود را فراموش کردید؟</TheButton>
    </div>

  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { Eye, EyeOff } from "lucide-vue-next";

const authStore = useAuthStore()

const isPassword = ref(true)
const isRegister = ref(false)

const nameValue = ref('')
const emailValue = ref('')
const passwordValue = ref('')
const otpValue = ref('')

const showPassword = ref(false)

const isEmailValid = computed(() => {
  if (!emailValue.value) return false
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(emailValue.value)
})

const canSubmitLogin = computed(() => isEmailValid.value && !!passwordValue.value)
const canSubmitRegister = computed(() => !!nameValue.value && isEmailValid.value && !!passwordValue.value)

const toggleRegister = () => {
  isRegister.value = !isRegister.value
  authStore.clearError()
}

const handleSubmit = async () => {
  authStore.clearError()

  if (authStore.awaitingOtp) {
    if (!otpValue.value) return
    await authStore.verifyOtp(otpValue.value)
    return
  }

  if (isRegister.value) {
    if (!canSubmitRegister.value) return
    await authStore.register({ name: nameValue.value, email: emailValue.value, password: passwordValue.value })
    if (authStore.awaitingOtp) {
      // Hide prior fields; OTP UI will show automatically
      passwordValue.value = ''
    }
    return
  }

  // Login flow
  if (!canSubmitLogin.value) return
  await authStore.passwordLogin(emailValue.value, passwordValue.value)
}

// Expose for potential use in template or parent components
defineExpose({})
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(266deg, #3624CB 8.21%, #1B1265 94.07%);
}
</style>