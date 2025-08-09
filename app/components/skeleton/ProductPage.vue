<template>
  <div class="flex flex-col lg:flex-row justify-between w-full gap-6 h-full" aria-busy="true">
    <!-- Left column: name, mobile image, summary, options, original tag, gallery -->
    <div class="order-2 lg:order-1 basis-full lg:basis-1/3 flex h-full flex-col lg:sticky lg:top-24 gap-8">
      <!-- Name -->
      <div class="w-full order-3 lg:order-1">
        <Skeleton class="h-8 w-2/3 mb-2" />
        <Skeleton class="h-5 w-4/5 hidden lg:block" />
      </div>

      <!-- Mobile image -->
      <figure class="block lg:hidden w-full aspect-square h-auto max-w-[80%] md:max-w-[60%] mx-auto order-1">
        <Skeleton class="w-full h-full" />
      </figure>

      <!-- Summary -->
      <div class="text-muted-foreground body-2 relative order-4 lg:order-2">
        <div class="flex flex-col gap-2">
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-11/12" />
          <Skeleton class="h-4 w-10/12" />
          <Skeleton class="h-4 w-2/3" />
        </div>
      </div>

      <!-- Options -->
      <ul class="mb-4 order-5 lg:order-3 flex flex-col gap-2">
        <li class="list-inside">
          <Skeleton class="h-4 w-3/4" />
        </li>
        <li class="list-inside">
          <Skeleton class="h-4 w-2/3" />
        </li>
        <li class="list-inside">
          <Skeleton class="h-4 w-5/6" />
        </li>
        <li>
          <Skeleton class="h-6 w-24" />
        </li>
      </ul>

      <!-- Original tag -->
      <div class="order-6 lg:order-4">
        <Skeleton class="h-10 w-48 rounded-full" />
      </div>

      <!-- Gallery -->
      <div class="product-gallery flex gap-2 w-full grow order-2 lg:order-5">
        <div class="basis-1/3">
          <Skeleton class="w-full aspect-square" />
        </div>
        <div class="basis-1/3">
          <Skeleton class="w-full aspect-square" />
        </div>
        <div class="basis-1/3">
          <Skeleton class="w-full aspect-square" />
        </div>
      </div>
    </div>

    <!-- Middle column: heading and desktop image -->
    <div class="order-1 lg:order-2 basis-full lg:basis-2/3">
      <!-- Heading mimic -->
      <div class="mb-4 flex justify-center flex-col items-center">
        <Skeleton class="h-10 w-1/2 mx-auto lg:mx-0" />
        <Skeleton class="h-6 w-2/3 mt-2 mx-auto lg:mx-0" />
      </div>

      <!-- Desktop image -->
      <figure class="hidden lg:block w-full aspect-square h-auto max-w-[80%] md:max-w-[60%] mx-auto">
        <Skeleton class="w-full h-full" />
      </figure>
    </div>

    <!-- Right column: selectors, price, quantity, add-to-cart -->
    <div class="order-3 lg:order-3 basis-full lg:basis-1/3 flex flex-col lg:sticky lg:top-24 h-fit gap-8">
      <!-- Color Selection -->
      <div class="color-selection flex gap-2 flex-col">
        <Skeleton class="h-6 w-28 mb-2" />
        <div class="flex flex-wrap gap-2">
          <Skeleton v-for="i in 6" :key="'color-'+i" class="h-10 w-10 rounded-full" />
        </div>
      </div>

      <!-- Size Selection -->
      <div class="size-selection flex flex-col gap-2">
        <Skeleton class="h-6 w-24 mb-2" />
        <div class="flex flex-wrap gap-2">
          <Skeleton class="h-10 w-16 rounded-md" />
          <Skeleton class="h-10 w-20 rounded-md" />
          <Skeleton class="h-10 w-14 rounded-md" />
          <Skeleton class="h-10 w-24 rounded-md" />
          <Skeleton class="h-10 w-12 rounded-md" />
        </div>
      </div>

      <!-- Price (desktop only) -->
      <div class="flex-col gap-2 hidden lg:flex">
        <Skeleton class="h-6 w-32 mb-2" />
        <div class="flex gap-2 items-baseline">
          <Skeleton class="h-8 w-40" />
        </div>
      </div>

      <!-- Quantity + Add to cart (desktop only) -->
      <div class="gap-2 mb-4 w-full hidden lg:flex">
        <div class="quantity-selection flex items-center gap-2 mb-4">
          <Skeleton class="h-10 w-10 rounded-md" />
          <Skeleton class="h-6 w-8" />
          <Skeleton class="h-10 w-10 rounded-md" />
        </div>
        <Skeleton class="h-10 w-full rounded-md" />
      </div>
    </div>
  </div>

  <!-- Mobile bottom sticky bar -->
  <Teleport to="body">
    <div class="fixed bottom-0 left-0 w-full z-50 p-4 lg:hidden">
      <div class="background-backdrop bg-background/90! flex justify-between flex-col sm:flex-row gap-4 p-4 rounded-lg border border-border">
        <div class="flex-col gap-2">
          <div class="flex gap-2 items-baseline">
            <Skeleton class="h-7 w-32" />
          </div>
        </div>
        <div class="gap-2 w-full sm:w-auto flex justify-between items-center">
          <div class="quantity-selection flex items-center gap-2">
            <Skeleton class="h-9 w-9 rounded-md" />
            <Skeleton class="h-5 w-8" />
            <Skeleton class="h-9 w-9 rounded-md" />
          </div>
          <Skeleton class="h-9 w-full sm:w-40 rounded-md" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Skeleton } from '~/components/ui/skeleton'
</script> 