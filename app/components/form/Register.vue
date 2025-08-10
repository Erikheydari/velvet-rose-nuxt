<template>
  <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit">
    <template v-if="!authStore.awaitingOtp">
      <TheInput
        v-model="nameValue"
        placeholder="نام نمایشی"
        class="h-12"
        :disabled="authStore.loading"
      />

      <TheInput
        v-model="emailValue"
        placeholder="ایمیل"
        class="h-12"
        :aria-invalid="!isEmailValid && emailValue.length > 0"
        :disabled="authStore.loading"
        inputmode="email"
      />

      <div class="flex flex-row gap-3 w-full items-center relative">
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

      <TheButton
        type="submit"
        :disabled="!canSubmit || authStore.loading"
        class="gradient-background"
        size="lg"
        :loading="authStore.loading"
      >
        ارسال کد
      </TheButton>
    </template>

    <template v-else>
      <TheInput
        v-model="otpValue"
        placeholder="کد تایید"
        class="h-12"
        :disabled="authStore.loading"
        inputmode="numeric"
      />
      <TheButton
        type="button"
        class="gradient-background"
        size="lg"
        :disabled="!otpValue || authStore.loading"
        :loading="authStore.loading"
        @click="handleVerify"
      >
        تایید کد
      </TheButton>
      <p class="text-sm text-muted-foreground">کد تایید ارسال شده را وارد کنید.</p>
    </template>
  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { Eye, EyeOff } from "lucide-vue-next";
import { toast } from 'vue-sonner'

const authStore = useAuthStore()

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

const canSubmit = computed(() => !!nameValue.value && isEmailValid.value && !!passwordValue.value)

watch(() => authStore.error, (val) => {
  if (val) toast.error(val)
})

const handleSubmit = async () => {
  if (!canSubmit.value) return
  await authStore.register({ name: nameValue.value, email: emailValue.value, password: passwordValue.value })
  if (authStore.awaitingOtp) {
    passwordValue.value = ''
  }
}

const handleVerify = async () => {
  if (!otpValue.value) return
  await authStore.verifyOtp(otpValue.value)
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(266deg, #3624CB 8.21%, #1B1265 94.07%);
}
</style> 