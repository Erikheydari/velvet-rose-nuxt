<template>
  <section class="h-screen lg:h-[80vh] w-full relative">

    <h2
      class="hidden lg:flex flex-col heading-3 text-primary font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-5/6 z-1">
      <span class="text-nowrap">
        به بهتریــــــــــــــــــــــــــــــــــــــــــــــــن نسخه از
      </span>
      <span class="text-nowrap">
        خودت تــــــــــــــــــــــــــــــــــــــــــــــــــبدیل شو!
      </span>
    </h2>

    <h2
      class="flex flex-col lg:hidden heading-3 text-primary font-bold text-center absolute top-20 left-1/2 -translate-x-1/2 z-1">
      <span class="text-nowrap">
        به بهتریـــــــــــــــــــــــــــن نسخه از
      </span>
      <span class="text-nowrap">
        خودت تــــــــــــــــــــــــــــبدیل شو!
      </span>
    </h2>

    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-4/6 rounded-full bg-secondary aspect-square object z-0">
    </div>


    <img src="/images/before.webp" alt="before-after"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 min-w-120 w-full lg:w-[50vw] h-[80%] object-contain z-3 object-bottom back-image" />
    <img src="/images/after.webp" alt="before-after"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 min-w-120 w-full lg:w-[50vw] h-[80%] object-contain z-2 object-bottom front-image" />
  </section>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.object {
  width: clamp(18rem, 25vw, 25rem);
}
</style>