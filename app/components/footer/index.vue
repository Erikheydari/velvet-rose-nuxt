<template>
  <footer class="w-full bg-primary pt-14 relative z-10">
    <div
      class="lg-inner-container pb-14 flex flex-col lg:flex-row lg:items-start lg:justify-between flex-wrap gap-14 px-10">
      <div class="space-y-4 basis-1/3 text-center lg:text-start">
        <LogoWhite variant="light" class="w-40 lg:w-60 mx-auto lg:mx-0" />
        <p class="body-2 text-primary-foreground" @click="isAboutOpen = !isAboutOpen"
          :class="isAboutOpen ? 'line-clamp-none' : 'line-clamp-2'">
          ما باور داریم که لوکس بودن تنها به محصولات محدود نمیشوند،بلکه یک
          تجربه کامل و بی نقص از خرید را شامل میشود.
        </p>
      </div>
      <div class="space-y-6">
        <h4 class="heading-5 text-primary-foreground text-center lg:text-start">
          دسترسی سریع
        </h4>
        <ul class="space-y-2 text-center lg:text-start">
          <li v-for="item in navItems" :key="item.label">
            <FooterNavItem :to="item.to">
              {{ item.label }}
            </FooterNavItem>
          </li>
        </ul>
      </div>
      <div class="space-y-6">
        <h4 class="heading-5 text-primary-foreground text-center lg:text-start">
          راه های ارتباطی
        </h4>
        <ul class="space-y-2 text-center lg:text-start">
          <li v-for="item in contactItems" :key="item.label">
            <FooterNavItem :href="item.href" :target="item.target">
              {{ item.label }}
            </FooterNavItem>
          </li>
        </ul>
        <ul class="flex flex-row gap-2 justify-center lg:justify-start">
          <li v-for="item in socialItems" :key="item.label">
            <TheButton variant="default" class="size-10 bg-background/10" size="icon" :href="item.href" target="_blank">
              <component :is="iconMap[item.icon as keyof typeof iconMap]"
                class="size-6 text-primary-foreground hover:text-primary-foreground" />
            </TheButton>
          </li>
        </ul>
      </div>
    </div>
    <p dir="ltr" class="body-2 text-primary-foreground text-center py-4 border-t border-border/50">
      All Copyrights Reserved For VelvetRose
    </p>
  </footer>
</template>

<script setup lang="ts">
import LogoWhite from '~/assets/icons/logo-white.svg?component';
import { navItems, contactItems, socialItems } from '~/constants/navItems';
import Instagram from '~/assets/icons/instagram.svg?component';
import Telegram from '~/assets/icons/telegram.svg?component';
import X from '~/assets/icons/x.svg?component';

// Map string names to imported SVG components
const iconMap = {
  Instagram,
  Telegram,
  X,
};

const isAboutOpen = ref(false);
</script>