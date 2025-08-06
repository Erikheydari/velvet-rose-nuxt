<template>
  <div class="flex flex-col h-full menu-body-height overflow-y-auto">
    <MenuMobileListItem v-for="item in headerPages" :key="item.text" :item="item" :is-active="false" />
  </div>
</template>

<script lang="ts" setup>
import { headerPages } from '~/constants/headerNavItems'
</script>
