<template>
  <div class="w-full h-full">
    <TheHeader />
    <main class="w-full h-full">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { TheHeader } from '~/components/header';

</script>

<style></style>