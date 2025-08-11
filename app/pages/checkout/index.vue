<template>
  <div>

  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  router.push({
    path: '/checkout/cart',
  })
})

</script>

<style></style>