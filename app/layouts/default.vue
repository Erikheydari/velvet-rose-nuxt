<template>
  <div class="w-full h-full">
    <TheHeader />
    <main class="w-full h-full">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script lang="ts" setup>
import { TheFooter } from '~/components/footer';
import { TheHeader } from '~/components/header';

</script>

<style></style>