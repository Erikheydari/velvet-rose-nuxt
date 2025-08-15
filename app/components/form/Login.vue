<template>
    <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit" autocomplete="on">
        <TheInput v-if="!showOtp" v-model="emailValue" placeholder="ایمیل" class="h-12"
            :aria-invalid="!isEmailValid && emailValue.length > 0" :disabled="authStore.loading" inputmode="email" />

        <div class="flex flex-row gap-3 w-full items-center relative">
            <TheInput v-if="!showOtp" v-model="passwordValue" placeholder="رمز عبور" class="h-12 grow"
                :disabled="authStore.loading" :type="showPassword ? 'text' : 'password'" />
            <TheButton v-if="!showOtp" variant="ghost" size="sm" @click.prevent="showPassword = !showPassword"
                class="absolute top-1/2 -translate-y-1/2 end-2">
                <Eye v-if="showPassword" class="size-4" />
                <EyeOff v-else class="size-4" />
            </TheButton>
            <TheInput v-else v-model="otpValue" placeholder="کد یکبار مصرف" class="h-12" :disabled="authStore.loading"
                :type="showOtp ? 'text' : 'password'" />
        </div>

        <TheButton v-if="!showOtp" type="submit" :disabled="!canSubmit || authStore.loading" size="lg"
            class="gradient-background" :loading="authStore.loading">
            <span v-if="authStore.loading">در حال ورود...</span>
            <span v-else>ورود به حساب</span>
        </TheButton>

        <TheButton v-else type="submit" :disabled="!canSubmit || authStore.loading" size="lg"
            class="gradient-background" :loading="authStore.loading">s
            <span v-if="authStore.loading">در حال تایید...</span>
            <span v-else>تایید کد</span>
        </TheButton>

        <p v-if="authStore.needVerify" class="text-sm">
            کد یکبار مصرف به ایمیل شما ارسال شده است.
        </p>
        
    </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { Eye, EyeOff } from "lucide-vue-next";
import { toast } from 'vue-sonner'

const authStore = useAuthStore()

const emailValue = ref('')
const passwordValue = ref('')
const showPassword = ref(false)
const otpValue = ref('')
const showOtp = computed(() => authStore.needVerify)

const isEmailValid = computed(() => {
    if (!emailValue.value) return false
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(emailValue.value)
})

const canSubmitPassword = computed(() => isEmailValid.value && !!passwordValue.value)
const canSubmitOtp = computed(() => isEmailValid.value && !!otpValue.value)
const canSubmit = computed(() => showOtp.value ? canSubmitOtp.value : canSubmitPassword.value)

watch(() => authStore.error, (val) => {
    if (val) toast.error(val)
})

const handleSubmit = async () => {
    if (!canSubmit.value) return
    if (showOtp.value) {
        await authStore.verifyOtp(otpValue.value)
        return
    }
    await authStore.passwordLogin(emailValue.value, passwordValue.value)
}

</script>

<style scoped>
.gradient-background {
    background: linear-gradient(266deg, #3624CB 8.21%, #1B1265 94.07%);
}
</style>