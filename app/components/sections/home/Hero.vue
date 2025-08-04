<template>
  <section class="w-full h-screen flex items-center justify-center bg-video relative">
    <h1 class="heading-1 text-primary font-italiana absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      Velvet Rose
    </h1>
    <video autoplay muted loop class="w-full h-full absolute top-0 left-0 object-cover">
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
  </section>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.bg-video {
  background-image: url('/videos/hero.mp4');
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
}
</style>