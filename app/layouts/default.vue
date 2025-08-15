<template>
  <div class="w-full h-full">
    <Header>
      <template v-if="router.currentRoute.value.path.startsWith('/product/')" #left-section>
        <TheButton
          variant="tonal"
          size="icon-lg"
          class="shrink-0 lg:hidden"
          @click="handleBack"
        >
          <ArrowRight class="size-5" />
        </TheButton>

        <CartTrigger class="flex lg:hidden" :handle-button-click="toggleCart" />
        <CartPopover class="flex lg:hidden" :is-active="isCartOpen" :close-cart="() => isCartOpen = false" />
      </template>
    </Header>
    <main class="w-full h-full">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from 'lucide-vue-next'  



const router = useRouter()
const isCartOpen = ref(false)

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

// Track if user navigated internally
const internalNavCount = ref(0)

// Watch navigation
onMounted(() => {
  router.afterEach((to, from) => {
    if (from.name && to.name && from.name !== to.name) {
      internalNavCount.value++
    }
  })
})

// Can go back only if there's internal navigation
const canGoBack = computed(() => internalNavCount.value > 0)

// Handle back navigation
const handleBack = () => {
  if (internalNavCount.value > 0) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
