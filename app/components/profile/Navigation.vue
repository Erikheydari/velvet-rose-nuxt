<template>
    <nav class="space-y-2">
        <h2 class="heading-6 font-bold text-foreground mb-4">حساب کاربری</h2>

        <TheButton v-for="item in navigationItems" :key="item.path" :to="item.path"
            :variant="isActiveRoute(item.path) ? 'default' : 'ghost'"
            class="justify-start w-full px-4! gap-3! text-sm!">
            <component :is="item.icon" class="size-4 transition-colors" />
            <span>{{ item.label }}</span>
            <ChevronLeft v-if="isActiveRoute(item.path)" class="w-4 h-4 mr-auto text-primary-foreground" />
        </TheButton>

        <!-- Logout Button -->
        <TheButton variant="ghost" class="justify-start w-full px-4! gap-3! text-sm! text-destructive"
            @click="handleLogout">
            <LogOut class="size-4" />
            <span>خروج از حساب</span>
        </TheButton>
    </nav>
</template>

<script lang="ts" setup>
import { User, ShoppingBag, Settings, Shield, LogOut, ChevronLeft } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const navigationItems = [
    {
        path: '/profile',
        label: 'اطلاعات حساب',
        icon: User,
    },
    {
        path: '/profile/orders',
        label: 'سفارشات من',
        icon: ShoppingBag,
    },
    {
        path: '/profile/security',
        label: 'امنیت حساب',
        icon: Shield,
    },
]

const isActiveRoute = (path: string) => {
    if (path === '/profile') {
        return route.path === '/profile'
    }
    return route.path.startsWith(path)
}

const handleLogout = async () => {
    try {
        await authStore.logout()
    } catch (error) {
        console.error('Logout error:', error)
    }
}
</script>

<style scoped></style>
