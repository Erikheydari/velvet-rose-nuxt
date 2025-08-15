<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="heading-6 font-bold">سفارشات من</h1>
        <p class="body-2 text-muted-foreground">مشاهده و پیگیری سفارشات شما</p>
      </div>
      <TheButton variant="outline" size="sm" @click="refresh" :disabled="loading">
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        بروزرسانی
      </TheButton>
    </div>

    <!-- Orders Content -->
    <TheCard class="bg-background border">
      <TheCardContent>
        <div v-if="loading" class="text-center">
          <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p class="mt-4 body-2 text-muted-foreground">در حال بارگذاری سفارشات...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <div class="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle class="w-8 h-8 text-destructive" />
          </div>
          <h3 class="heading-6 font-semibold text-destructive mb-2">خطا در بارگذاری</h3>
          <p class="body-2 text-muted-foreground mb-4">{{ error }}</p>
          <TheButton variant="outline" @click="refresh">
            تلاش مجدد
          </TheButton>
        </div>

        <div v-else>
          <div v-if="orders.length === 0" class="text-center py-16">
            <div class="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag class="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 class="heading-6 font-semibold text-muted-foreground mb-2">هیچ سفارشی یافت نشد</h3>
            <p class="body-2 text-muted-foreground mb-6">هنوز سفارشی ثبت نکرده‌اید</p>
            <TheButton variant="default" to="/products">
              شروع خرید
            </TheButton>
          </div>
          
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between mb-4">
              <p class="body-2 text-muted-foreground">{{ orders.length }} سفارش یافت شد</p>
            </div>
            <OrderCard
              v-for="order in orders"
              :key="order.id"
              :order="order"
              @click="goToOrder(order.id)"
            />
          </div>
        </div>
      </TheCardContent>
    </TheCard>
  </div>
</template>

<script lang="ts" setup>
import { RefreshCw, AlertCircle, ShoppingBag } from 'lucide-vue-next'

const ordersStore = useOrdersStore()
const router = useRouter()

const loading = computed(() => ordersStore.loading)
const error = computed(() => ordersStore.error)
const orders = computed(() => ordersStore.orders)

const fetch = async () => {
  await ordersStore.fetchOrders()
}

const refresh = () => fetch()

const goToOrder = (id: number | string) => {
  router.push(`/profile/orders/${id}`)
}

onMounted(fetch)

definePageMeta({
  middleware: 'auth',
  layout: 'profile'
})

useHead({
  title: 'سفارشات من',
})
</script>

<style scoped>

</style>