<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

// Protect this route - only authenticated users can access
definePageMeta({
  middleware: 'auth',
  layout: 'auth'
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
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">

      <!-- User Information Card -->
      <div class="bg-white rounded-lg border p-6 mb-6">
        <h2 class="title-4 mb-4">اطلاعات حساب کاربری</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-muted">ایمیل:</label>
            <p class="text-foreground">{{ authStore.currentUser?.email || 'ثبت نشده' }}</p>
          </div>
          
          <div class="space-y-2" v-if="authStore.currentUser?.name">
            <label class="text-sm font-medium text-muted">نام:</label>
            <p class="text-foreground">{{ authStore.currentUser.name }}</p>
          </div>
          
          <div class="space-y-2" v-if="authStore.currentUser?.phone">
            <label class="text-sm font-medium text-muted">شماره تماس:</label>
            <p class="text-foreground">{{ authStore.currentUser.phone }}</p>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-muted">شناسه کاربری:</label>
            <p class="text-foreground text-sm font-mono">{{ authStore.currentUser?.id || 'نامشخص' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink to="/orders" class="block">
          <TheCard class="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="flex items-center gap-3">
              <Icon icon="solar:bag-linear" class="text-2xl text-primary"/>
              <div>
                <h3 class="font-medium">سفارشات من</h3>
                <p class="text-sm text-muted">مشاهده تاریخچه خرید</p>
              </div>
            </div>
          </TheCard>
        </NuxtLink>

        <TheCard class="p-4">
          <div class="flex items-center gap-3">
            <Icon icon="solar:settings-linear" class="text-2xl text-primary"/>
            <div>
              <h3 class="font-medium">تنظیمات</h3>
              <p class="text-sm text-muted">ویرایش اطلاعات کاربری</p>
            </div>
          </div>
        </TheCard>

        <TheCard class="p-4">
          <div class="flex items-center gap-3">
            <Icon icon="solar:shield-check-linear" class="text-2xl text-primary"/>
            <div>
              <h3 class="font-medium">امنیت حساب</h3>
              <p class="text-sm text-muted">تغییر رمز عبور</p>
            </div>
          </div>
        </TheCard>
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

<style scoped>

</style>