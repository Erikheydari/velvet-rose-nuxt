<template>
    <teleport to="body">
        <div class="md:hidden h-screen fixed top-0 right-0 z-[52]" :class="{ 'pointer-events-none': !open }">

            <div class="fixed top-0 right-0 z-50 w-full max-w-xs bg-background shadow-lg transition-transform duration-300 ease-in-out h-screen"
                :class="{ 'translate-x-0': open, 'translate-x-full': !open }" dir="rtl">
                <div class="flex flex-col h-full">
                    <div class="flex items-center px-2 py-4 border-b border-border gap-2">
                        <Button variant="ghost" size="icon" @click="handleClose" aria-label="Close menu">
                            <Icon name="hugeicons:arrow-right-01" class="text-xl" />
                        </Button>

                        <h2 class="heading-5">منو</h2>
                    </div>

                    <div class="flex-1">
<!--                         <MenuTabs v-model="activeTab" />
                        <MenuList :active-tab="activeTab" /> -->
                    </div>
                </div>
            </div>
        </div>
    
        <Backdrop :is-active="open" :handle-close="handleClose" />
    </teleport>
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue'
// import MenuTabs from './MenuTabs.vue'
// import MenuList from './MenuList.vue';
import { Backdrop } from '@/components/ui/backdrop'

interface Props {
    open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const activeTab = ref('productCategories')

const handleClose = () => {
    emit('close')
}

// Control body overflow based on menu state
watch(() => props.open, (isOpen) => {
    if (typeof window === 'undefined') return

    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}, { immediate: true })

// Clean up when component is unmounted
onUnmounted(() => {
    if (typeof window === 'undefined') return
    document.body.style.overflow = ''
})

</script>

<style>

</style>