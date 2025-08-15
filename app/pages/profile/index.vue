<script setup lang="ts">
import { User, ShoppingBag, Shield } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

// Protect this route - only authenticated users can access
definePageMeta({
  middleware: 'auth',
  layout: 'profile'
})

useHead({
  title: 'پروفایل کاربری',
  meta: [
    { name: 'description', content: 'صفحه پروفایل کاربری' }
  ]
})

const authStore = useAuthStore()

const joinDate = computed(() => {
  const user = authStore.currentUser as any
  if (!user?.created_at) return 'نامشخص'
  try {
    const date = new Date(user.created_at)
    return date.toLocaleDateString('fa-IR')
  } catch {
    return 'نامشخص'
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="heading-5 font-bold">اطلاعات حساب کاربری</h1>
        <p class="body-2 text-muted-foreground mt-1">مدیریت اطلاعات شخصی و تنظیمات حساب</p>
      </div>
    </div>

    <!-- User Information Card -->
    <TheCard class="bg-background border py-0">
      <TheCardContent class="p-6 space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User class="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 class="heading-6 font-semibold">{{ authStore.currentUser?.name || 'کاربر عزیز' }}</h3>
            <p class="body-2 text-muted-foreground">{{ authStore.currentUser?.email || 'ایمیل ثبت نشده' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="body-2 font-medium text-muted-foreground">ایمیل</label>
            <p class="body-1 text-foreground">{{ authStore.currentUser?.email || 'ثبت نشده' }}</p>
          </div>

          <div class="space-y-2" v-if="authStore.currentUser?.name">
            <label class="body-2 font-medium text-muted-foreground">نام کاربری</label>
            <p class="body-1 text-foreground">{{ authStore.currentUser.name }}</p>
          </div>

          <div class="space-y-2">
            <label class="body-2 font-medium text-muted-foreground">شناسه کاربری</label>
            <p class="body-1 text-foreground font-mono">{{ authStore.currentUser?.id || 'نامشخص' }}</p>
          </div>

          <div class="space-y-2">
            <label class="body-2 font-medium text-muted-foreground">تاریخ عضویت</label>
            <p class="body-1 text-foreground">{{ joinDate }}</p>
          </div>
        </div>
      </TheCardContent>
    </TheCard>

    <!-- Error Display -->
    <TheCard v-if="authStore.error" class="bg-destructive/10 border border-destructive/20">
      <TheCardContent class="p-4">
        <p class="text-destructive">{{ authStore.error }}</p>
      </TheCardContent>
    </TheCard>
  </div>
</template>

<style scoped></style>