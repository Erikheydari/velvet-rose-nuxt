<template>
    <form class="flex flex-col gap-3 w-full" @submit.prevent="handleSubmit">
        <TheInput v-model="emailValue" placeholder="ایمیل" class="h-12"
            :aria-invalid="!isEmailValid && emailValue.length > 0" :disabled="authStore.loading" inputmode="email" />

        <div class="flex flex-row gap-3 w-full items-center relative">
            <TheInput v-model="passwordValue" placeholder="رمز عبور" class="h-12 grow" :disabled="authStore.loading"
                :type="showPassword ? 'text' : 'password'" />
            <TheButton variant="ghost" size="sm" @click.prevent="showPassword = !showPassword"
                class="absolute top-1/2 -translate-y-1/2 end-2">
                <Eye v-if="showPassword" class="size-4" />
                <EyeOff v-else class="size-4" />
            </TheButton>
        </div>

        <TheButton type="submit" :disabled="!canSubmit || authStore.loading" size="lg" class="gradient-background"
            :loading="authStore.loading">
            <span v-if="authStore.loading">در حال ورود...</span>
            <span v-else>ورود به حساب</span>
        </TheButton>

        <div class="flex flex-row gap-3 justify-between">
            <!--             <TheButton variant="ghost" size="sm" @click.prevent="toggleOtp">
                {{ isOtp ? 'ورود با رمز عبور' : 'ورود با کد یکبار مصرف' }}
            </TheButton> -->
        </div>
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
const isOtp = ref(false)

const isEmailValid = computed(() => {
    if (!emailValue.value) return false
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(emailValue.value)
})

const canSubmit = computed(() => isEmailValid.value && !!passwordValue.value)

watch(() => authStore.error, (val) => {
    if (val) toast.error(val)
})

const toggleOtp = () => {
    isOtp.value = !isOtp.value
    // Placeholder: OTP login not implemented per requirements
    toast.info('ورود با کد یکبار مصرف به زودی فعال می‌شود')
}

const handleSubmit = async () => {
    if (!canSubmit.value) return
    await authStore.passwordLogin(emailValue.value, passwordValue.value)
}
</script>

<style scoped>
.gradient-background {
    background: linear-gradient(266deg, #3624CB 8.21%, #1B1265 94.07%);
}
</style>