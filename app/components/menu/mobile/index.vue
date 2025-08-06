<template>
    <teleport to="body">
        <div class="md:hidden h-screen fixed top-0 right-0 z-[52]" :class="{ 'pointer-events-none': !open }">

            <div class="fixed top-0 right-0 z-50 w-full max-w-xs bg-background shadow-lg transition-transform duration-300 ease-in-out h-screen"
                :class="{ 'translate-x-0': open, 'translate-x-full': !open }" dir="rtl">
                <div class="flex flex-col h-full">
                    <div class="flex items-center p-2 border-b border-border gap-2">
                        <TheButton variant="ghost" size="icon" @click="handleClose" aria-label="Close menu">
                            <ArrowRight class="size-5" />
                        </TheButton>

                        <h2 class="heading-5 -mt-2">منو</h2>
                    </div>

                    <div class="flex-1">
                        <MenuMobileTabs v-model="activeTab" />
                        <MenuMobileList :active-tab="activeTab" />
                    </div>
                </div>
            </div>
        </div>

        <Backdrop :is-active="open" :handle-close="handleClose" />
    </teleport>
</template>

<script lang="ts" setup>
import { ArrowRight } from 'lucide-vue-next';
import { ref, watch, onUnmounted } from 'vue'
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

<style></style>