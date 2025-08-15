<template>
  <TheCard
    class="w-full bg-background border hover:border-primary/40 transition-colors cursor-pointer "
    role="button"
  >
    <TheCardContent class="p-4 sm:p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="body-2 text-muted-foreground">شماره سفارش:</span>
            <span class="font-semibold">#{{ order.id }}</span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span v-if="displayDate">تاریخ: {{ displayDate }}</span>
            <span v-if="statusLabel" class="inline-flex items-center gap-1">
              <span class="w-2 h-2 rounded-full" :class="statusDotClass"></span>
              {{ statusLabel }}
            </span>
            <span v-if="itemsCount !== null">تعداد آیتم‌ها: {{ itemsCount }}</span>
          </div>
        </div>

        <div class="text-left min-w-[120px]">
          <div class="text-sm text-muted-foreground">مبلغ</div>
          <div class="font-bold">{{ formattedTotal }}</div>
        </div>
      </div>
    </TheCardContent>
  </TheCard>
</template>

<script lang="ts" setup>
type OrderLike = Record<string, any>

const props = defineProps<{ order: OrderLike }>()

const formattedTotal = computed(() => {
  // Based on API data structure: final_price, total_price, or fallback
  const total = props.order.final_price ?? props.order.total_price ?? props.order.total ?? 0
  // The API returns strings like "4,100,000", so we need to handle that
  const cleanTotal = String(total).replace(/,/g, '')
  const numericTotal = Number(cleanTotal) || 0
  return `${numericTotal.toLocaleString('fa-IR')} تومان`
})

const itemsCount = computed(() => {
  const items = props.order.items ?? []
  return Array.isArray(items) ? items.length : null
})

const displayDate = computed(() => {
  const raw = props.order.created_at ?? props.order.date ?? null
  if (!raw) return null
  try {
    const d = new Date(raw)
    if (isNaN(d.getTime())) return String(raw)
    return d.toLocaleDateString('fa-IR')
  } catch {
    return String(raw)
  }
})

const statusLabel = computed(() => {
  // For now, we'll assume all orders are completed since we don't have status in the API
  // You can add status field to API later if needed
  return 'تکمیل شده'
})

const statusDotClass = computed(() => {
  // Since we don't have status in API, assume completed
  return 'bg-success'
})
</script>

<style scoped>

</style>



