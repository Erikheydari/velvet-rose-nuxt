<template>
  <div></div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const route = useRoute()
const { setReturnUrl } = useAuthRedirect()

if (import.meta.client) {
  const from = document?.referrer || ''
  // Save intended target if came directly or via link
  if (route?.redirectedFrom?.fullPath) {
    setReturnUrl(route.redirectedFrom.fullPath)
  }
}

navigateTo('/auth/login')
</script>

<style>
</style>