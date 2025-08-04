<template>
  <header class="w-full sticky top-0 z-50 transition-all duration-300 -mb-24"
    :class="{ 'bg-background/90 backdrop-blur': isSticky }">
    <div class="w-full py-4 px-8 transition-all duration-300" :class="{ 'py-2': isSticky }">
      <div class="w-full flex items-center justify-between">
        <div class="flex items-center gap-2">
          <TheButton variant="tonal" size="lg">
            <User />
            <span>ورود / ثبت نام</span>
          </TheButton>
          <TheButton variant="tonal" size="icon-lg">
            <Search />
          </TheButton>
        </div>

        <div class="flex items-center gap-2">
          <ul class="flex items-center gap-2">
            <li v-for="item in headerNavItems" :key="item.label">
              <TheButton variant="link" class="text-foreground/70 hover:text-primary" size="lg"
                :class="{ 'text-primary': $route.path === item.to }" :to="item.to">
                {{ item.label }}
              </TheButton>
            </li>
          </ul>
        </div>

        <Logo class="transition-all duration-300 flex-shrink-0" :class="{ 'h-12': isSticky, 'h-16': !isSticky }" />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import Logo from '~/assets/icons/logo.svg?component'
import { User, Search } from 'lucide-vue-next';
import { useWindowScroll } from '@vueuse/core';
import { headerNavItems, headerUserItems } from '~/constants/headerNavItems';

const { y } = useWindowScroll();


// Add some debouncing to prevent excessive updates
const isSticky = computed(() => y.value > 100);
</script>

<style>
</style>