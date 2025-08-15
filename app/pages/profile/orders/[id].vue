<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <TheButton variant="ghost" size="sm" @click="goBack" class="px-2">
            <ArrowRight class="w-4 h-4" />
          </TheButton>
          <h1 class="heading-6 font-bold">جزئیات سفارش #{{ route.params.id }}</h1>
        </div>
        <p class="body-2 text-muted-foreground">مشاهده جزئیات و وضعیت سفارش</p>
      </div>
      <TheButton variant="outline" size="sm" @click="fetchDetail" :disabled="loading">
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        بروزرسانی
      </TheButton>
    </div>

    <!-- Content -->
    <div class="space-y-6">
      <div v-if="loading" class="py-12 text-center">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto">
          <Loader2 class="w-4 h-4" />
        </div>
        <p class="mt-4 body-2 text-muted-foreground">در حال بارگذاری...</p>
      </div>

      <TheCard v-else-if="error" class="bg-destructive/10 border border-destructive/20">
        <TheCardContent class="p-6 text-center">
          <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle class="w-8 h-8 text-destructive" />
          </div>
          <h3 class="heading-6 font-semibold text-destructive mb-2">خطا در بارگذاری</h3>
          <p class="body-2 text-muted-foreground mb-4">{{ error }}</p>
          <TheButton variant="outline" @click="fetchDetail">
            تلاش مجدد
          </TheButton>
        </TheCardContent>
      </TheCard>

      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <!-- Order Information -->
            <TheCard class="bg-background border">
              <TheCardContent class="p-6">
                <h3 class="heading-6 font-semibold mb-4">اطلاعات سفارش</h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-2">
                    <span class="body-2 text-muted-foreground">وضعیت سفارش:</span>
                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                      <div class="w-2 h-2 rounded-full bg-success"></div>
                      تکمیل شده
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="body-2 text-muted-foreground">تاریخ:</span>
                    <span>{{ createdAt }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="body-2 text-muted-foreground">مبلغ کالاها:</span>
                    <span class="font-medium">{{ formattedTotalPrice }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="body-2 text-muted-foreground">هزینه ارسال:</span>
                    <span class="font-medium">{{ formattedDeliveryAmount }}</span>
                  </div>
                  <div class="flex items-center gap-2 pt-2 border-t border-border">
                    <span class="body-2 text-muted-foreground">مبلغ نهایی:</span>
                    <span class="font-bold text-lg">{{ formattedTotal }}</span>
                  </div>
                  <div v-if="order.description" class="pt-2 border-t border-border">
                    <span class="body-2 text-muted-foreground">توضیحات:</span>
                    <p class="mt-1 text-sm">{{ order.description }}</p>
                  </div>
                </div>
              </TheCardContent>
            </TheCard>

            <!-- Order Items -->
            <TheCard class="bg-background border">
              <TheCardContent class="p-6">
                <h3 class="heading-6 font-semibold mb-4">آیتم‌های سفارش</h3>
                <div class="space-y-4">
                  <ProductCartCard
                    v-for="(item, idx) in orderItems"
                    :key="idx"
                    :product="item.product"
                    :quantity="item.quantity || 1"
                    :order-item="item"
                    mode="order"
                    orientation="horizontal"
                  />
                </div>
              </TheCardContent>
            </TheCard>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <TheCard class="bg-background border">
              <TheCardContent class="p-6">
                <h3 class="heading-6 font-semibold mb-4">اطلاعات ارسال</h3>
                <div class="space-y-3">
                  <div v-if="order.full_name" class="flex items-center gap-2">
                    <span class="body-2 text-muted-foreground">نام گیرنده:</span>
                    <span class="body-2 font-medium">{{ order.full_name }}</span>
                  </div>
                  <div v-if="order.phone_number" class="flex items-center gap-2">
                    <span class="body-2 text-muted-foreground">شماره تماس:</span>
                    <span class="body-2 font-medium">{{ order.phone_number }}</span>
                  </div>
                  <div v-if="order.address" class="flex flex-col gap-1">
                    <span class="body-2 text-muted-foreground">آدرس:</span>
                    <span class="body-2">{{ order.address }}</span>
                  </div>
                  <div v-if="order.postal_code" class="flex items-center gap-2">
                    <span class="body-2 text-muted-foreground">کد پستی:</span>
                    <span class="body-2 font-mono">{{ order.postal_code }}</span>
                  </div>
                </div>
              </TheCardContent>
            </TheCard>

            <TheButton as-child variant="default" class="w-full">
              <NuxtLink to="/profile/orders">بازگشت به سفارشات</NuxtLink>
            </TheButton>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)
const order = computed<any>(() => ordersStore.selectedOrder || {})

const goBack = () => {
  router.push('/profile/orders')
}

const formatCurrency = (n: number) => `${Number(n || 0).toLocaleString('fa-IR')} تومان`

const formattedTotal = computed(() => {
  const total = order.value.final_price ?? order.value.total_price ?? order.value.total ?? 0
  const cleanTotal = String(total).replace(/,/g, '')
  return formatCurrency(Number(cleanTotal) || 0)
})

const formattedTotalPrice = computed(() => {
  const total = order.value.total_price ?? 0
  const cleanTotal = String(total).replace(/,/g, '')
  return formatCurrency(Number(cleanTotal) || 0)
})

const formattedDeliveryAmount = computed(() => {
  const delivery = order.value.delivery_amount ?? 0
  const cleanDelivery = String(delivery).replace(/,/g, '')
  return formatCurrency(Number(cleanDelivery) || 0)
})

const createdAt = computed(() => {
  const raw = order.value.created_at ?? order.value.date
  if (!raw) return 'نامشخص'
  try {
    const d = new Date(raw)
    if (isNaN(d.getTime())) return String(raw)
    return d.toLocaleDateString('fa-IR')
  } catch {
    return String(raw)
  }
})

const orderItems = computed<any[]>(() => {
  const items = order.value.items ?? order.value.order_items ?? []
  return Array.isArray(items) ? items : []
})

const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) return
  await ordersStore.fetchOrderDetail(id)
}

onMounted(fetchDetail)

definePageMeta({
  middleware: 'auth',
  layout: 'profile'
})

useHead({ title: `سفارش #${String(route.params.id || '')}` })
</script>

<style scoped>

</style>