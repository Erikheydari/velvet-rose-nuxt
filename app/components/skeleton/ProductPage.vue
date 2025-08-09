<template>
  <div class="flex flex-col lg:flex-row justify-between w-full gap-6" aria-busy="true">
    <div class="basis-full lg:basis-1/3 flex flex-col gap-6">
      <div class="w-full">
        <Skeleton class="h-7 w-2/3 mb-2" />
        <Skeleton class="h-5 w-5/6" />
      </div>
      <div class="flex flex-col gap-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-11/12" />
        <Skeleton class="h-4 w-10/12" />
        <Skeleton class="h-4 w-2/3" />
      </div>
      <div class="flex gap-2">
        <Skeleton class="h-8 w-16 rounded-full" />
        <Skeleton class="h-8 w-20 rounded-full" />
        <Skeleton class="h-8 w-14 rounded-full" />
      </div>
      <div class="flex gap-2">
        <Skeleton class="h-32 w-32" />
        <Skeleton class="h-32 w-32" />
        <Skeleton class="h-32 w-32" />
      </div>
    </div>

    <div class="basis-full lg:basis-2/3">
      <Skeleton class="w-full aspect-square h-auto max-w-[80%] md:max-w-[60%] mx-auto" />
    </div>

    <div class="basis-full lg:basis-1/3 flex flex-col gap-4">
      <Skeleton class="h-5 w-32" />
      <Skeleton class="h-8 w-40" />
      <div class="flex gap-2">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-10 w-24" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Skeleton } from '~/components/ui/skeleton'
</script> 