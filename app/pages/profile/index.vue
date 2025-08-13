<script setup lang="ts">
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

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="container mx-auto default-padding-top">
    <div class="max-w-4xl mx-auto">

      <!-- User Information Card -->
      <div class="bg-background rounded-lg border p-6 mb-6">
        <h2 class="title-4 mb-4">اطلاعات حساب کاربری</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-muted-foreground">ایمیل:</label>
            <p class="text-foreground">{{ authStore.currentUser?.email || 'ثبت نشده' }}</p>
          </div>

          <div class="space-y-2" v-if="authStore.currentUser?.name">
            <label class="text-sm font-medium text-muted-foreground">نام:</label>
            <p class="text-foreground">{{ authStore.currentUser.name }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-muted-foreground">شناسه کاربری:</label>
            <p class="text-foreground text-sm font-mono">{{ authStore.currentUser?.id || 'نامشخص' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex flex-col gap-4 default-padding-x lg:px-0!">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TheButton to="/profile/orders" variant="tonal" size="lg">
            <span class="font-medium">سفارشات من</span>
          </TheButton>

          <TheButton to="/profile/settings" variant="tonal" size="lg">
            <span class="font-medium">تنظیمات</span>
          </TheButton>

          <TheButton to="/profile/security" variant="tonal" size="lg">
            <span class="font-medium">امنیت حساب</span>
          </TheButton>

          <TheButton @click="handleLogout" variant="tonal" size="lg">
            <span class="font-medium">خروج</span>
          </TheButton>
        </div>
      </div>


      <!-- Loading State -->
      <div v-if="authStore.loading" class="text-center py-8">
        <p class="text-muted">در حال بارگذاری...</p>
      </div>

      <!-- Error Display -->
      <div v-if="authStore.error" class="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-4">
        <p class="text-destructive">{{ authStore.error }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>