<template>
  <div class="w-full default-padding-x lg-inner-container default-padding-top">
    <section class="default-inner-container default-padding-x mb-24">
      <div class="flex flex-col lg:flex-row-reverse lg:items-center gap-10">
        <img
          src="/images/about/contact.png"
          alt="contact-us"
          class="w-full max-w-[27.5rem] mx-auto lg:mx-0"
          loading="lazy"
        />
        <form class="flex-1" @submit.prevent="handleSubmit">
          <h1 class="heading-3 text-primary font-extrabold mb-2 text-center lg:text-start">ارتباط با ما</h1>
          <p class="body-1 text-primary/60 mb-12 text-center lg:text-start">
            شما میتوانید از طریق فرم زیر یا راه های ارتباطی دیگر با ما در ارتباط باشید
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="body-2 text-primary/80 mb-2 block">نام و نام خانوادگی</label>
              <Input v-model="form.name" class="h-12 px-4 lg:px-6" placeholder="نام و نام خانوادگی" :aria-invalid="!!errors.name" />
              <p v-if="errors.name" class="caption-2 text-destructive mt-1">{{ errors.name }}</p>
            </div>

            <div>
              <label class="body-2 text-primary/80 mb-2 block">ایمیل</label>
              <Input v-model="form.email" class="h-12 px-4 lg:px-6" type="email" placeholder="ایمیل" :aria-invalid="!!errors.email" />
              <p v-if="errors.email" class="caption-2 text-destructive mt-1">{{ errors.email }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="body-2 text-primary/80 mb-2 block">موضوع</label>
              <Input v-model="form.subject" class="h-12 px-4 lg:px-6" placeholder="موضوع" :aria-invalid="!!errors.subject" />
              <p v-if="errors.subject" class="caption-2 text-destructive mt-1">{{ errors.subject }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="body-2 text-primary/80 mb-2 block">توضیحات</label>
              <Textarea v-model="form.description" class="px-4 lg:px-6" placeholder="توضیحات" rows="6" :aria-invalid="!!errors.description" />
              <p v-if="errors.description" class="caption-2 text-destructive mt-1">{{ errors.description }}</p>
            </div>
          </div>

          <TheButton type="submit" size="lg" class="rounded-2xl px-8" :disabled="loading">
            <Loader2 v-if="loading" class="size-4 animate-spin" />
            <span v-else>ثبت درخواست</span>
          </TheButton>
        </form>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useApiStore } from '@/stores/api'
import { useEndpointStore } from '@/stores/endpoints'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import { TheButton } from '#components'

const apiStore = useApiStore()
const endpointStore = useEndpointStore()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  description: '',
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  description: '',
})

const loading = ref(false)

const validate = () => {
  errors.name = form.name ? '' : 'نام را وارد کنید'
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'ایمیل معتبر نیست'
  errors.subject = form.subject ? '' : 'موضوع را وارد کنید'
  errors.description = form.description ? '' : 'توضیحات را وارد کنید'
  return !errors.name && !errors.email && !errors.subject && !errors.description
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.subject = ''
  form.description = ''
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

const handleSubmit = async () => {
  if (!validate()) return
  
  loading.value = true
  
  try {
    const response = await apiStore.apiRequest(
      endpointStore.contact.send,
      {
        method: 'post',
        body: {
          name: form.name,
          email: form.email,
          subject: form.subject,
          description: form.description
        }
      }
    )

    if (response.error) {
      toast.error('خطا در ارسال پیام. لطفا دوباره تلاش کنید.')
      return
    }

    toast.success('پیام شما با موفقیت ارسال شد')
    resetForm()
    
  } catch (error) {
    console.error('Contact form error:', error)
    toast.error('خطا در ارسال پیام. لطفا دوباره تلاش کنید.')
  } finally {
    loading.value = false
  }
}
</script>

<style>
</style>