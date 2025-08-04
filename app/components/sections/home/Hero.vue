<template>
  <section class="w-full h-screen flex items-center justify-center bg-video relative bg-background">
    <h1 class="heading-1 text-primary font-italiana absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      Velvet Rose
    </h1>
    <video autoplay muted loop class="w-full h-full absolute top-0 left-0 object-cover ">
      <source src="/videos/hero.mp4" type="video/mp4"/>
    </video>
    <div class="absolute left-0 w-full h-[50vh] bottom-0 z-10 bg-gradient-to-t from-background to-transparent"></div>
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