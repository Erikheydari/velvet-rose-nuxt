<template>
  <div class="w-full min-h-screen">
    <Header />
    <main class="w-full default-padding-x pb-30 lg:pb-0">
      <div class="container mx-auto default-padding-top">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <!-- Navigation Sidebar -->
            <div class="lg:col-span-1">
              <TheCard class="bg-background border sticky top-24">
                <TheCardContent>
                  <ProfileNavigation />
                </TheCardContent>
              </TheCard>
            </div>

            <!-- Main Content -->
            <div class="lg:col-span-3">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>