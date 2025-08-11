<template>
  <div v-if="meta && (meta.last_page || 1) > 1" class="mt-6 mb-12">
    <Pagination
      :total="meta.total || 0"
      :items-per-page="meta.per_page || 12"
      :sibling-count="siblingCount"
      :page="meta.current_page || 1"
      @update:page="onPageChange"
    >
      <PaginationContent>
        <PaginationFirst />
        <PaginationPrevious />

        <template v-for="(item, index) in pageItems" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.page!"
            :is-active="item.page === (meta?.current_page || 1)"
          >
            {{ item.page }}
          </PaginationItem>
          <PaginationEllipsis v-else />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationContent>
    </Pagination>
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationFirst, PaginationLast, PaginationEllipsis } from '@/components/ui/pagination'

interface MetaLike {
  total?: number
  per_page?: number
  current_page?: number
  last_page?: number
}

const props = withDefaults(defineProps<{
  meta: MetaLike | null | undefined
  siblingCount?: number
  class?: HTMLAttributes['class']
}>(), {
  siblingCount: 1,
})

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const pageItems = computed(() => {
  const m = props.meta
  if (!m) return [] as Array<{ type: 'page' | 'ellipsis'; page?: number }>
  const current = m.current_page || 1
  const last = m.last_page || 1
  const siblings = props.siblingCount ?? 1
  const pages: Array<{ type: 'page' | 'ellipsis'; page?: number }> = []

  const start = Math.max(1, current - siblings)
  const end = Math.min(last, current + siblings)

  if (start > 1) {
    pages.push({ type: 'page', page: 1 })
    if (start > 2) pages.push({ type: 'ellipsis' })
  }

  for (let p = start; p <= end; p++) {
    pages.push({ type: 'page', page: p })
  }

  if (end < last) {
    if (end < last - 1) pages.push({ type: 'ellipsis' })
    pages.push({ type: 'page', page: last })
  }

  return pages
})

const onPageChange = (page: number) => {
  emit('update:page', page)
}
</script> 