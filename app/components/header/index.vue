<template>
  <header class="w-full sticky top-0 z-50 transition-all duration-300 -mb-36 lg:-mb-24"
    :class="{ 'background-backdrop-90': isSticky || isSearchOpen || isCartOpen }">
    <div class="w-full py-4 default-padding-x transition-all duration-300" :class="{ 'py-2': isSticky }">
      <div class="w-full flex items-center justify-between gap-2 lg:gap-4">

        <slot name="left-section" />

        <!-- Left Section - User & Search -->
        <div class="flex items-center gap-3 w-full">

          <div class="hidden lg:flex max-w-md">
            <Skeleton v-if="localLoading && !authStore.loading" class="size-12 lg:w-24 rounded-full relative">
              <Loader2 class="size-4 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </Skeleton>
            <TheButton v-else-if="!authStore.token" variant="tonal" size="lg" class="shrink-0" :to="`/auth/login`">
              <User class="w-4 h-4" />
              <span class="hidden sm:inline">ورود / ثبت نام</span>
            </TheButton>

            <DropdownMenu v-else dir="rtl">
              <DropdownMenuTrigger>
                <TheButton variant="tonal" size="lg" class="shrink-0">
                  <User class="size-4" />
                  <span class="hidden sm:inline">
                    سلام! {{ authStore.currentUser?.name }}
                  </span>
                  <ChevronDown class="size-3 mt-2" />
                </TheButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-52" align="start">
                <DropdownMenuItem>
                  <User class="stroke-1" />
                  مشاهده حساب کاربری
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ScrollText class="stroke-1" />
                  مشاهده سفارشات
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" class="items-center" @click="authStore.logout">
                  <LogOut class="-mb-1 stroke-1" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Search :search-query="searchQuery" :handle-button-click="toggleSearch" />

          <div class="hidden lg:block min-w-0 flex-1 max-w-md relative" id="cart-trigger">
            <CartTrigger :handle-button-click="toggleCart" />
            <CartPopover :is-active="isCartOpen" :close-cart="() => isCartOpen = false" />
          </div>
        </div>

        <!-- Right Section - Logo -->
        <NuxtLink to="/" class="shrink-0 hidden lg:block">
          <Logo class="transition-all duration-300 z-49" :class="{ 'h-10 md:h-12': isSticky, 'h-14 md:h-16': !isSticky }"
            alt="لوگو سایت" />
        </NuxtLink>
      </div>
    </div>

    <!-- Center Section - Navigation -->
    <nav
      class="hidden lg:flex items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 h-12 px-8 ">
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
    <SearchOverlay :is-active="isSearchOpen" :search-query="searchQuery" :close-search="closeSearch"
      :set-search-query="setSearchQuery" :navigate-to-search-page="navigateToSearchPage"
      :overlay-class="isSticky ? 'md:top-20' : 'md:top-24'" />



    <MenuMobile :open="isMenuOpen" @close="isMenuOpen = false" />

    <BottomNavigation v-if="!router.currentRoute.value.path.includes('product')" class="flex justify-between w-full">

      <TheButton variant="tonal" size="icon-lg" class="shrink-0 bg-primary hover:bg-primary/90" to="/">
        <Home class="size-5 text-secondary" />
      </TheButton>

      <MenuMobileTrigger @toggle="toggleMenu" :class="isMenuOpen ? 'bg-primary hover:bg-primary/90' : ''"
        :iconClass="isMenuOpen ? 'text-secondary' : ''" />

      <CartTrigger :handle-button-click="toggleCart" />


      <TheButton v-if="!authStore.token" variant="tonal" size="lg" class="shrink-0" :to="`/auth/login`">
        <User class="w-4 h-4" />
        <span class="hidden sm:inline">ورود / ثبت نام</span>
      </TheButton>

      <TheButton v-else variant="tonal" size="icon-lg" class="shrink-0" to="/profile">
        <User class="size-5" />
      </TheButton>

    </BottomNavigation>

  </header>
</template>

<script lang="ts" setup>
import Logo from '~/assets/icons/logo.svg?component'
import { User, Loader2, LogOut, ScrollText, ChevronDown, Home } from 'lucide-vue-next'
import { useWindowScroll } from '@vueuse/core'
import { headerNavItems } from '~/constants/headerNavItems'
import { useSearch } from '~/composables/useSearch'
import { useAuthStore } from '~/stores/auth'
import { Skeleton } from '~/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const localLoading = ref(true)

// Kick a background auth check if we have a token but no user
const triedAuthCheck = ref(false)
watch(
  () => [authStore.token, authStore.currentUser, authStore.loading],
  async ([tok, usr, isLoading]) => {
    if (import.meta.client && tok && !usr && !isLoading && !triedAuthCheck.value) {
      triedAuthCheck.value = true
      await authStore.checkAuthStatus()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    await authStore.checkAuthStatus()
  } catch (error) {
    console.error(error)
  } finally {
    localLoading.value = false
  }
})

// Sticky header logic
const { y } = useWindowScroll()
const isSticky = computed(() => y.value > 100)
const isMenuOpen = ref(false)
const isCartOpen = ref(false)

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
  if (isSearchOpen) {
    closeSearch()
  }
}

const toggleSearch = () => {
  handleSearchButtonClick()
  if (isCartOpen.value) {
    isCartOpen.value = false
  }
}


const toggleMenu = () => {
  isMenuOpen.value = true
}

// Search functionality
const {
  isSearchOpen,
  searchQuery,
  handleSearchButtonClick,
  closeSearch,
  setSearchQuery,
  navigateToSearchPage
} = useSearch()
</script>