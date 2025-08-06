<template>
  <header 
    class="w-full sticky top-0 z-50 transition-all duration-300 -mb-24"
    :class="{ 'bg-background/90 backdrop-blur-md shadow-sm': isSticky }"
  >
    <div 
      class="w-full py-4 px-8 transition-all duration-300" 
      :class="{ 'py-2': isSticky }"
    >
      <div class="w-full flex items-center justify-between gap-4">
        <!-- Left Section - User & Search -->
        <div class="flex items-center gap-3">
          <TheButton variant="tonal" size="lg" class="shrink-0">
            <User class="w-4 h-4" />
            <span class="hidden sm:inline">ورود / ثبت نام</span>
          </TheButton>
          
          <div class="min-w-0 flex-1 max-w-md">
            <Search 
              :search-query="searchQuery" 
              :handle-button-click="handleButtonClick" 
            />
          </div>
        </div>
        
        <!-- Center Section - Navigation -->
        <nav class="hidden md:flex items-center">
          <ul class="flex items-center gap-1">
            <li v-for="item in headerNavItems" :key="item.label">
              <TheButton 
                variant="link" 
                size="lg"
                class="text-foreground/70 hover:text-primary transition-colors"
                :class="{ 'text-primary font-medium': $route.path === item.to }" 
                :to="item.to"
              >
                {{ item.label }}
              </TheButton>
            </li>
          </ul>
        </nav>
        
        <!-- Right Section - Logo -->
        <NuxtLink to="/" class="shrink-0">
          <Logo 
            class="transition-all duration-300" 
            :class="{ 'h-12': isSticky, 'h-16': !isSticky }"
            alt="لوگو سایت" 
          />
        </NuxtLink>
      </div>
    </div>
    
    <!-- Search Overlay -->
    <SearchOverlay 
      :is-active="isActive" 
      :search-query="searchQuery" 
      :close-search="closeSearch"
      :set-search-query="setSearchQuery"
      :navigate-to-search-page="navigateToSearchPage"
    />
  </header>
</template>

<script lang="ts" setup>
import Logo from '~/assets/icons/logo.svg?component'
import { User } from 'lucide-vue-next'
import { useWindowScroll } from '@vueuse/core'
import { headerNavItems } from '~/constants/headerNavItems'
import { useSearch } from '~/composables/useSearch'

// Sticky header logic
const { y } = useWindowScroll()
const isSticky = computed(() => y.value > 100)

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