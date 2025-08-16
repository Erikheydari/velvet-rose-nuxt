<template>
    <div class="w-auto flex items-center justify-center ">
        <p
            class="text-primary body-2 flex items-baseline justify-center">
            <span class="text-primary body-2">
                {{ props.percentage }}
            </span>
            <span class="text-primary caption-2 me-2">
                %
            </span>
            تخفیف
        </p>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    percentage: number
}>()
</script>