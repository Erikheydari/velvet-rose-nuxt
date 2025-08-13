<template>
  <div class="min-h-[60vh] bg-background flex default-padding-top items-center justify-center font-kalameh">
    <TheCard class="max-w-lg w-full border border-border bg-muted/10">


      <TheCardContent class="space-y-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="relative mb-14">
            <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <p class="mt-4 body-2 text-muted-foreground">در حال تأیید پرداخت...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-6">
          <div class="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X class="w-10 h-10 text-destructive" />
          </div>
          <h3 class="heading-5 text-destructive font-semibold mb-2">خطا در تأیید پرداخت</h3>
          <p class="body-2 text-muted-foreground mb-6">{{ error }}</p>
          <TheButton variant="link" class="w-fit" :to="'/'">
            بازگشت به صفحه اصلی
          </TheButton>
        </div>

        <!-- Success State -->
        <div v-else-if="verificationResult" class="space-y-6">
          <!-- Status Icon and Title -->
          <div class="text-center">
            <div v-if="verificationResult.status === '200'" 
                 class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check class="w-10 h-10 text-success" />
            </div>
            <div v-else 
                 class="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CircleHelp class="w-10 h-10 text-warning" />
            </div>
            
            <h3 class="heading-4 text-card-foreground font-bold mb-2">
              {{ verificationResult.status === '200' ? 'پرداخت موفقیت‌آمیز!' : 'وضعیت پرداخت' }}
            </h3>
            <p class="body-2 text-muted-foreground">
              {{ verificationResult.status === '200' ? 'تراکنش شما با موفقیت انجام شد' : 'لطفاً وضعیت تراکنش را بررسی کنید' }}
            </p>
          </div>

          <!-- Verification Details -->
          <Card class="bg-muted/30 border-0">
            <CardContent class="pt-6">
              <h4 class="heading-6 text-card-foreground font-semibold mb-4 text-center">جزئیات تراکنش</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-border/50">
                  <span class="body-2 text-muted-foreground">وضعیت:</span>
                  <span class="body-2 font-medium text-card-foreground">{{ verificationResult.status }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-border/50">
                  <span class="body-2 text-muted-foreground">کد پیگیری:</span>
                  <span class="body-2 font-mono text-primary break-all">{{ authority }}</span>
                </div>
                <div v-if="verificationResult.ref_id" class="flex justify-between items-center py-2 border-b border-border/50">
                  <span class="body-2 text-muted-foreground">شماره مرجع:</span>
                  <span class="body-2 font-mono text-primary break-all">{{ verificationResult.ref_id }}</span>
                </div>
                <div v-if="verificationResult.amount" class="flex justify-between items-center py-2">
                  <span class="body-2 text-muted-foreground">مبلغ:</span>
                  <span class="body-2 font-medium text-card-foreground">{{ verificationResult.amount }} تومان</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <Button as-child variant="default" class="w-full">
              <NuxtLink to="/">بازگشت به صفحه اصلی</NuxtLink>
            </Button>
            
            <Button as-child variant="outline" class="w-full">
              <NuxtLink to="/products">ادامه خرید</NuxtLink>
            </Button>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else class="text-center py-6">
          <div class="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CircleHelp class="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 class="heading-5 text-muted-foreground font-semibold mb-2">اطلاعات تأیید یافت نشد</h3>
          <p class="body-2 text-muted-foreground mb-6">قادر به تأیید پرداخت نیستیم. لطفاً پارامترهای URL را بررسی کنید.</p>
          <Button as-child variant="default" class="w-full">
            <NuxtLink to="/">بازگشت به صفحه اصلی</NuxtLink>
          </Button>
        </div>
      </TheCardContent>
    </TheCard>
  </div>
</template>

<script lang="ts" setup>
import { X, CircleHelp } from 'lucide-vue-next';

const route = useRoute()
const paymentsStore = usePaymentsStore()

const loading = ref(true)
const error = ref<string | null>(null)
const verificationResult = ref<any>(null)
const authority = ref<string | null>(null)

// Extract Authority from URL query parameters
onMounted(() => {
  // Get query parameters from the route
  const authorityParam = route.query.Authority as string
  const statusParam = route.query.Status as string
  
  if (authorityParam) {
    authority.value = authorityParam
    
    // Set the authority in the payments store
    paymentsStore.paymentAuthority = authorityParam
    
    // Call the payment verification
    verifyPayment()
  } else {
    error.value = 'پارامتر کد پیگیری در URL یافت نشد'
    loading.value = false
  }
})

const verifyPayment = async () => {
  try {
    loading.value = true
    error.value = null

    // Set the authority in the store
    paymentsStore.paymentAuthority = authority.value
    
    // Call the verification API
    const result = await paymentsStore.verifyPayment(authority.value as string)
    
    if (result) {
      verificationResult.value = result
    } else {
      error.value = 'تأیید پرداخت ناموفق بود'
    }
  } catch (err: any) {
    error.value = err.message || 'خطایی در تأیید پرداخت رخ داد'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.break-all {
  word-break: break-all;
}
</style>
