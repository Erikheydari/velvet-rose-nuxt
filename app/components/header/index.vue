<template>
  <header class="w-full sticky top-0 z-50 transition-all duration-300 -mb-36 lg:-mb-24"
    :class="{ 'background-backdrop-90': isSticky || isActive }">
    <div class="w-full py-4 default-padding-x transition-all duration-300" :class="{ 'py-2': isSticky }">
      <div class="w-full flex items-center justify-between gap-4">
        <!-- Left Section - User & Search -->
        <div class="flex items-center gap-3">
          <MenuMobileTrigger @toggle="toggleMenu" />

          <Skeleton v-if="authStore.loading" class="size-12 lg:w-24 rounded-full relative">
            <Loader2 class="w-4 h-4 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </Skeleton>
          <TheButton v-else-if="!authStore.isLoggedIn" variant="tonal" size="lg" class="shrink-0" :to="`/auth/login`">
            <User class="w-4 h-4" />
            <span class="hidden sm:inline">ورود / ثبت نام</span>
          </TheButton>

          <DropdownMenu v-else dir="rtl">
            <DropdownMenuTrigger>
              <TheButton variant="tonal" size="lg" class="shrink-0">
                <User class="size-4" />
                <span class="hidden sm:inline">حساب کاربری</span>
              </TheButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-52" align="start">
              <DropdownMenuItem>
                <User class="stroke-1" />
                مشاهده حساب کاربری
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ScrollText class="stroke-1" />
                مشاهده سفارشات"
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" class="items-center" @click="authStore.logout">
                <LogOut class="-mb-1 stroke-1" />
                خروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div class="min-w-0 flex-1 max-w-md">
            <Search :search-query="searchQuery" :handle-button-click="handleButtonClick" />
          </div>
        </div>

        <!-- Right Section - Logo -->
        <NuxtLink to="/" class="shrink-0">
          <Logo class="transition-all duration-300 z-49"
            :class="{ 'h-10 md:h-12': isSticky, 'h-14 md:h-16': !isSticky }" alt="لوگو سایت" />
        </NuxtLink>
      </div>
    </div>

    <!-- Center Section - Navigation -->
    <nav
      class="hidden md:flex items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 h-12 px-8 ">
      <ul class="flex items-center gap-1">
        <li v-for="item in headerNavItems" :key="item.label">
          <TheButton variant="link" size="lg" class="text-foreground/70 hover:text-primary transition-colors"
            :class="{ 'text-primary font-medium': $route.path === item.to }" :to="item.to">
            {{ item.label }}
          </TheButton>
        </li>
      </ul>
    </nav>

    <!-- Search Overlay -->
    <SearchOverlay :is-active="isActive" :search-query="searchQuery" :close-search="closeSearch"
      :set-search-query="setSearchQuery" :navigate-to-search-page="navigateToSearchPage"
      :overlay-class="isSticky ? 'md:top-20' : 'md:top-24'" />

    <MenuMobile :open="isMenuOpen" @close="isMenuOpen = false" />
  </header>
</template>

<script lang="ts" setup>
import Logo from '~/assets/icons/logo.svg?component'
import { User, Loader2, LogOut, ScrollText } from 'lucide-vue-next'
import { useWindowScroll } from '@vueuse/core'
import { headerNavItems } from '~/constants/headerNavItems'
import { useSearch } from '~/composables/useSearch'
import { useAuthStore } from '~/stores/auth'
import { Skeleton } from '~/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

const authStore = useAuthStore()


// Sticky header logic
const { y } = useWindowScroll()
const isSticky = computed(() => y.value > 100)
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = true
}

// Search functionality
const {
  isActive,
  searchQuery,
  handleButtonClick,
  closeSearch,
  setSearchQuery,
  navigateToSearchPage
} = useSearch()
</script>