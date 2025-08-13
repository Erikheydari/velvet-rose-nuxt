<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit" autocomplete="on">

    <div class="flex flex-col gap-2 lg:gap-4 p-4 border-border border rounded-2xl bg-background">
      <Label class="w-full">مشخصات گیرنده</Label>

      <div class="flex flex-col lg:flex-row gap-4 w-full bg-background">
        <TheInput v-model="fullName" class="w-full h-12! body-2 px-6 lg:px-8" placeholder="نام کامل گیرنده" name="name"
          autocomplete="name" required :aria-invalid="!isFullNameValid && fullName.length > 0" enterkeyhint="next" />

        <TheInput v-model="phoneNumber" class="w-full h-12! body-2 px-6 lg:px-8" placeholder="شماره تلفن گیرنده"
          name="tel" type="tel" inputmode="numeric" pattern="^09[0-9]{9}$" maxlength="11" dir="ltr" autocomplete="tel"
          required :aria-invalid="!isPhoneValid && phoneNumber.length > 0" enterkeyhint="next" @input="handlePhoneInput"
          @keydown="handlePhoneKeydown" />

      </div>

    </div>

    <div class="flex flex-col gap-2 lg:gap-4 p-4 border-border border rounded-2xl bg-background">
      <Label class="w-full">آدرس</Label>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="w-full">
          <Select v-model="provinceModel" :disabled="ordersStore.loading">
            <SelectTrigger class="w-full h-12! body-2 rounded-full bg-input border-primary px-6 lg:px-8"
              :disabled="ordersStore.loading">
              <SelectValue placeholder="استان" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>استان</SelectLabel>
                <SelectItem v-for="p in ordersStore.provinces" :key="p.id" :value="String(p.id)">{{ p.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="w-full">
          <Select v-model="cityModel" :disabled="ordersStore.loading || !ordersStore.selectedProvinceId">
            <SelectTrigger class="w-full h-12! body-2 rounded-full bg-input border-primary px-6 lg:px-8"
              :disabled="ordersStore.loading || !ordersStore.selectedProvinceId">
              <SelectValue placeholder="شهر" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>شهر</SelectLabel>
                <SelectItem v-for="c in ordersStore.cities" :key="c.id" :value="String(c.id)">{{ c.name }}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TheInput v-model="address" class="w-full h-12! body-2 px-6 lg:px-8" placeholder="آدرس کامل" name="street-address"
        autocomplete="shipping street-address" required :aria-invalid="!isAddressValid && address.length > 0"
        enterkeyhint="next" />

    </div>

    <div class="flex flex-col gap-2 lg:gap-4 p-4 border-border border rounded-2xl bg-background">
      <Label class="w-full">توضیحات</Label>

      <Textarea v-model="description" class="w-full body-2 px-6 lg:px-8 pt-4" rows="6" placeholder="توضیحات (اختیاری)"
        name="comment" autocomplete="off" />
    </div>

    <TheButton v-if="!paymentsStore.paymentAuthority" type="submit" :disabled="!canSubmit || ordersStore.loading"
      class="gradient-background h-12 lg:h-14! body-2 px-8" :loading="ordersStore.loading">
      <span v-if="ordersStore.loading">
        <Loader2 class="size-4 animate-spin" />
      </span>
      <span v-else>ثبت سفارش</span>
    </TheButton>
  </form>
</template>

<script lang="ts" setup>
import { useOrdersStore } from '@/stores/orders'
import { toast } from 'vue-sonner'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '../ui/textarea'
import { usePaymentsStore } from '@/stores/payments'
import { Loader2 } from 'lucide-vue-next'

const paymentsStore = usePaymentsStore()
const ordersStore = useOrdersStore()

const address = ref('')
const fullName = ref('')
const phoneNumber = ref('')
const description = ref('')

// Select v-models use strings, we map to numbers in watchers
const provinceModel = ref<string | null>(null)
const cityModel = ref<string | null>(null)

const isAddressValid = computed(() => address.value.trim().length >= 5)
const isFullNameValid = computed(() => fullName.value.trim().length >= 2)
const isPhoneValid = computed(() => /^09\d{9}$/.test(phoneNumber.value))

const canSubmit = computed(() => {
  return isAddressValid.value && isFullNameValid.value && isPhoneValid.value && !!ordersStore.selectedProvinceId && !!ordersStore.selectedCityId
})

onMounted(async () => {
  if (!ordersStore.provinces.length) {
    await ordersStore.fetchProvinces()
  }
})

// Normalize Persian/Arabic digits to English and keep only numbers for phone
const toEnglishDigits = (value: string) => {
  return value
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
}

// Handle phone input with real-time conversion
const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const inputValue = target.value

  // Convert Persian/Arabic digits to English and remove non-digits
  const normalized = toEnglishDigits(inputValue).replace(/[^0-9]/g, '').slice(0, 11)

  // Update the input value if it changed
  if (normalized !== inputValue) {
    target.value = normalized
    phoneNumber.value = normalized
  }
}

// Prevent non-digit key presses
const handlePhoneKeydown = (event: KeyboardEvent) => {
  // Allow: backspace, delete, tab, escape, enter, navigation keys
  if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(event.keyCode)) {
    return
  }

  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
  if (event.ctrlKey && [65, 67, 86, 88].includes(event.keyCode)) {
    return
  }

  // Allow only digits 0-9
  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}

watch(provinceModel, async (newVal) => {
  if (!newVal) return
  const pid = Number(newVal)
  if (!Number.isNaN(pid)) {
    await ordersStore.fetchCitiesByProvince(pid)
  }
})

watch(cityModel, (newVal) => {
  if (!newVal) {
    ordersStore.selectedCityId = null as any
    return
  }
  const cid = Number(newVal)
  ordersStore.selectedCityId = Number.isNaN(cid) ? null : cid
})

const handleSubmit = async () => {
  if (!canSubmit.value || !ordersStore.selectedCityId) {
    toast.error('اطلاعات فرم صحیح نیست')
    return
  }
  const { data, paymentUrl, authority, error } = await ordersStore.createOrder({
    address: address.value,
    full_name: fullName.value,
    phone_number: phoneNumber.value,
    city_id: ordersStore.selectedCityId,
    description: description.value || undefined,
  })

  if (error) {
    toast.error(String(error))
    return
  }

  if (paymentUrl && authority) {
    paymentsStore.setPaymentUrl(paymentUrl, authority)
  }
  toast.success('سفارش با موفقیت ثبت شد')
}
</script>

<style scoped>
.gradient-background {
  background: linear-gradient(266deg, #3624CB 8.21%, #1B1265 94.07%);
}
</style>