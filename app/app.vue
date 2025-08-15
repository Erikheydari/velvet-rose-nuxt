<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Toaster position="top-center" dir="rtl" richColors />
</template>

<script lang="ts" setup>
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<style></style>