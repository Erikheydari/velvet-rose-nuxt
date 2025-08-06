<template>
  <div class="flex justify-end px-4 py-2">
    <NuxtLink :to="headerMainMenu.find(item => item.text === 'تماس با ما')?.link || '/contact'"
      class="btn btn-outline-primary body-4 w-full justify-between flex mb-4">
      صفحه تماس
    </NuxtLink>
    <TheButton variant="ghost" size="icon" class="h-13 w-13 rounded-none"
      @click="isContactExpanded = !isContactExpanded">
      <ChevronDown class="text-base text-primary" />
    </TheButton>
  </div>
  <transition name="slide-fade">


    <div v-if="isContactExpanded" class="bg-muted overflow-hidden">

      <!-- Contact Items -->
      <div v-for="contact in headerContact" :key="contact.label"
        class="flex items-center px-4 h-13 border-b border-border/50 mr-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center ml-4">
          <component :is="iconMap[contact.icon as keyof typeof iconMap]"
            class="size-6 text-primary  hover:stroke-primary" />
        </div>
        <a :href="contact.href" class="text-foreground body-3">{{ contact.label }}</a>
      </div>

      <!-- Social Items -->
      <div v-for="social in headerSocials" :key="social.label"
        class="flex items-center px-4 py-3 border-b border-border/30 mr-2">
        <div class="w-10 h-10 rounded-full flex items-center justify-center ml-4">
          <component :is="iconMap[social.icon as keyof typeof iconMap]"
            class="size-6 text-primary  hover:stroke-primary" />
        </div>
        <a :href="social.href" class="text-foreground body-3">{{ social.label }}</a>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import MenuItem from './MenuItem.vue'
import { type MainMenuData } from '~/constants/headerNavItems'
import { headerMainMenu, headerContact, headerSocials } from '~/constants/headerNavItems'
import Instagram from '~/assets/icons/instagram.svg?component';
import Telegram from '~/assets/icons/telegram.svg?component';
import X from '~/assets/icons/x.svg?component';
import { ChevronDown, Mail, Phone } from 'lucide-vue-next';

const props = defineProps<{
  mainMenuData: MainMenuData
}>()

const iconMap = {
  Instagram,
  Telegram,
  X,
  Mail,
  Phone,
};

const isContactExpanded = ref(true)
</script>

<style></style>