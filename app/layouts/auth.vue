<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuthRedirect } from '@/composables/useAuthRedirect'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const route = useRoute()
const { consumeReturnUrl } = useAuthRedirect()
const { isAuthenticated, token } = storeToRefs(authStore)

const redirectIfAuthenticated = async () => {
  if (!token.value) return
  // If token exists but user not validated yet, check profile
  if (!isAuthenticated.value) {
    await authStore.checkAuthStatus()
  }
  if (isAuthenticated.value) {
    if (import.meta.client) {
      const { toast } = await import('vue-sonner')
      toast.info('شما در حال حاضر وارد شدید!')
    }
    const saved = consumeReturnUrl()
    const target = saved && !saved.startsWith('/auth') ? saved : '/'
    await navigateTo(target, { replace: true })
  }
}

onMounted(() => {
  redirectIfAuthenticated()
})
</script>

<template>
  <section class="flex w-full h-screen justify-center items-center p-8 lg:p-0">
    <TheButton variant="link" to="/" class="px-0! absolute top-0 right-0">
      <ChevronRight class="size-4" />
      بازگشت
    </TheButton>

    <div
      class="default-inner-container w-full flex flex-col-reverse lg:flex-row lg:h-2/3 justify-between border-border border rounded-2xl overflow-hidden ">
      <div class="flex flex-col gap-4 justify-center items-center grow px-6 py-8 xl:px-12 xl:py-12 relative z-10 background-backdrop">
        <slot />
        <div class="w-full flex gap-4 flex-row justify-between">
          <TheButton v-if="route.path === '/auth/register'" variant="ghost" class="grow" to="/auth/login">
            ورود به حساب
          </TheButton>
          <TheButton v-if="route.path === '/auth/login'" variant="ghost" to="/auth/register">
            ثبت نام
          </TheButton>
          <TheButton v-if="route.path === '/auth/login'" variant="ghost" to="/auth/forgot-password">
            فراموشی رمز عبور
          </TheButton>
          <TheButton v-if="route.path === '/auth/forgot-password'" variant="ghost" class="grow" to="/auth/login">
            بازگشت به ورود
          </TheButton>
        </div>

      </div>
      <div class="lg:basis-2/3 overflow-hidden fixed lg:relative w-full h-full inset-0 z-0">
        <h1 class="heading-2 text-nowrap font-italiana w-full flex justify-center items-center py-8 relative lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-11 text-primary">
          Velvet Rose
        </h1>
        <video src="/videos/hero.mp4" autoplay muted loop
          class="w-full object-cover h-full absolute top-0 left-0 z-10"></video>
      </div>
    </div>

    <TheButton variant="link" class="absolute bottom-0 left-0">
      نیاز به پشتیبانی دارید؟
    </TheButton>
  </section>
</template>

<style scoped></style>