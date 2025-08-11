<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import type { Category } from '~/types/product.types'
import type { MainMenuItem } from '~/constants/headerNavItems'
import Instagram from '~/assets/icons/instagram.svg?component';
import Telegram from '~/assets/icons/telegram.svg?component';
import X from '~/assets/icons/x.svg?component';
import { Mail, Phone } from 'lucide-vue-next';


const isChildrenOpen = ref(false)

const props = defineProps<{
  item?: MainMenuItem
  category?: Category
  isActive: boolean
}>()

const emit = defineEmits<{
  showSubCategories: [category: Category]
}>()

const handleShowSubCategories = (event: Event, category: Category) => {
  event.preventDefault()
  event.stopPropagation()
  emit('showSubCategories', category)
}

const handleClickCollapse = (event: Event) => {
  if (props.item) {
    isChildrenOpen.value = !isChildrenOpen.value
    return
  } else if (props.category) {
    handleShowSubCategories(event, props.category!)
    return
  }
}

const calculateLink = () => {
  if (props.item) {
    return props.item.link
  }
  return '/products/' + props.category?.slug
}

const iconMap = {
  Instagram,
  Telegram,
  X,
  Mail,
  Phone,
}
</script>

<template>
  <div class="flex flex-col">

    <div class="flex items-center w-full h-12 border-b border-border/50">
      <TheButton :to="calculateLink()" size="lg" class="grow flex pr-4 items-center justify-between rounded-none"
        :class="{ 'bg-primary/5': isActive }" variant="ghost">
        <span class="body-1">{{ item?.text || category?.name }}</span>
      </TheButton>
      <TheButton v-if="item?.children" variant="ghost" size="icon-lg" class="rounded-none border-s border-s-border"
        @click.prevent="handleClickCollapse($event)" aria-label="Show subcategories">
        <ChevronDown class="text-xl transition-transform duration-300" :class="{ 'rotate-180': isChildrenOpen }" />
      </TheButton>
    </div>

    <transition name="slide-fade">
      <div v-if="item?.children && isChildrenOpen" class="flex flex-col bg-muted/50 max-h-96 overflow-y-auto">
        <TheButton v-for="child in item?.children" :key="child.label" variant="ghost" :to="child.slug"
          :target="child.href ? '_blank' : undefined" :href="child.href"
          size="lg"
          class="flex items-center justify-start px-4 border-b border-border/50 mr-2 body-2">
          <component :is="iconMap[child.icon as keyof typeof iconMap]"
            class="size-6 text-primary  hover:stroke-primary ml-4" />
          {{ child.label }}
        </TheButton>
      </div>
    </transition>
  </div>

</template>