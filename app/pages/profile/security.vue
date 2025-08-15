<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="heading-6 font-bold">امنیت حساب</h1>
        <p class="body-2 text-muted-foreground">مدیریت رمز عبور و تنظیمات امنیتی</p>
      </div>
    </div>

    <!-- Change Password Section -->
    <TheCard class="bg-background border">
      <TheCardContent class="p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Key class="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 class="heading-6 font-semibold">تغییر رمز عبور</h3>
            <p class="caption-1 text-muted-foreground">رمز عبور جدید خود را وارد کنید</p>
          </div>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <!-- Current Password -->
            <div class="flex flex-col gap-2">
              <label for="current_password" class="body-2 font-medium text-foreground">
                رمز عبور فعلی
              </label>
              <div class="relative">
                <TheInput
                  id="current_password"
                  v-model="form.current_password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                  class="pr-6 h-10!"
                  :class="{ 'border-destructive': errors.current_password }"
                  required
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye v-if="showCurrentPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="errors.current_password" class="text-sm text-destructive">
                {{ errors.current_password }}
              </p>
            </div>

            <!-- New Password -->
            <div class="flex flex-col gap-2">
              <label for="new_password" class="body-2 font-medium text-foreground">
                رمز عبور جدید
              </label>
              <div class="relative">
                <TheInput
                  id="new_password"
                  v-model="form.new_password"
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="رمز عبور جدید خود را وارد کنید"
                  class="pr-6! h-10!"
                  :class="{ 'border-destructive': errors.new_password }"
                  required
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye v-if="showNewPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="errors.new_password" class="text-sm text-destructive">
                {{ errors.new_password }}
              </p>
              <div class="space-y-1">
                <p class="text-xs text-muted-foreground">رمز عبور باید:</p>
                <ul class="text-xs text-muted-foreground space-y-1 mr-4">
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-muted-foreground"></div>
                    حداقل ۸ کاراکتر باشد
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-muted-foreground"></div>
                    شامل حروف بزرگ و کوچک باشد
                  </li>
                  <li class="flex items-center gap-2">
                    <div class="w-1 h-1 rounded-full bg-muted-foreground"></div>
                    شامل عدد باشد
                  </li>
                </ul>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div class="flex flex-col gap-2">
              <label for="new_password_confirmation" class="body-2 font-medium text-foreground">
                تکرار رمز عبور جدید
              </label>
              <div class="relative">
                <TheInput
                  id="new_password_confirmation"
                  v-model="form.new_password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="رمز عبور جدید را دوباره وارد کنید"
                  class="pr-6! h-10!"
                  :class="{ 'border-destructive': errors.new_password_confirmation }"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye v-if="showConfirmPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="errors.new_password_confirmation" class="text-sm text-destructive">
                {{ errors.new_password_confirmation }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4 border-t border-border">
            <TheButton 
              type="submit" 
              :disabled="loading || !isFormValid"
              class="flex items-center gap-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ loading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
            </TheButton>
            
            <TheButton 
              type="button" 
              variant="outline" 
              @click="resetForm"
              :disabled="loading"
            >
              انصراف
            </TheButton>
          </div>
        </form>
      </TheCardContent>
    </TheCard>

    <!-- Security Tips -->
    <TheCard class="bg-muted/30 border">
      <TheCardContent class="p-6">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle class="w-4 h-4 text-warning" />
          </div>
          <div>
            <h4 class="heading-6 font-semibold mb-2">نکات امنیتی</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li class="flex items-start gap-2">
                <div class="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                از رمز عبور قوی استفاده کنید که شامل حروف، اعداد و نمادها باشد
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                رمز عبور خود را به طور منظم تغییر دهید
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                رمز عبور خود را با دیگران به اشتراک نگذارید
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                از رمز عبور یکسان در سایت‌های مختلف استفاده نکنید
              </li>
            </ul>
          </div>
        </div>
      </TheCardContent>
    </TheCard>
  </div>
</template>

<script lang="ts" setup>
import { Key, Eye, EyeOff, Save, Loader2, AlertTriangle } from 'lucide-vue-next'
import { useProfileStore, type ChangePasswordPayload } from '@/stores/profile'

definePageMeta({
  middleware: 'auth',
  layout: 'profile'
})

useHead({
  title: 'امنیت حساب',
  meta: [
    { name: 'description', content: 'تنظیمات امنیتی حساب کاربری' }
  ]
})

const profileStore = useProfileStore()

// Form state
const form = reactive<ChangePasswordPayload>({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

// Show/hide password states
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form validation
const errors = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})

const loading = computed(() => profileStore.loading)

const isFormValid = computed(() => {
  return form.current_password.trim() !== '' &&
         form.new_password.trim() !== '' &&
         form.new_password_confirmation.trim() !== '' &&
         form.new_password === form.new_password_confirmation &&
         form.new_password.length >= 8
})

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validate current password
  if (!form.current_password.trim()) {
    errors.current_password = 'رمز عبور فعلی الزامی است'
    isValid = false
  }

  // Validate new password
  if (!form.new_password.trim()) {
    errors.new_password = 'رمز عبور جدید الزامی است'
    isValid = false
  } else if (form.new_password.length < 8) {
    errors.new_password = 'رمز عبور باید حداقل ۸ کاراکتر باشد'
    isValid = false
  }

  // Validate password confirmation
  if (!form.new_password_confirmation.trim()) {
    errors.new_password_confirmation = 'تکرار رمز عبور الزامی است'
    isValid = false
  } else if (form.new_password !== form.new_password_confirmation) {
    errors.new_password_confirmation = 'رمز عبور و تکرار آن مطابقت ندارند'
    isValid = false
  }

  return isValid
}

const handleChangePassword = async () => {
  if (!validateForm()) return

  const result = await profileStore.changePassword(form)
  
  if (result.success) {
    resetForm()
  }
}

const resetForm = () => {
  form.current_password = ''
  form.new_password = ''
  form.new_password_confirmation = ''
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}
</script>

<style scoped>

</style>
