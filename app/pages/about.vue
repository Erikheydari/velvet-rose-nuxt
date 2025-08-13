<template>
  <div class="w-full default-padding-x lg-inner-container default-padding-top">
    <!-- Hero -->
    <section class="default-inner-container default-padding-x pt-10 lg:pt-16 mb-20 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-0">
      <div class="w-full flex flex-col items-center text-center gap-6 lg:gap-12">
        <h1 class="heading-1 text-primary font-normal leading-[1] font-italiana text-nowrap">
          Velvet Rose
        </h1>
        <p class="body-1 text-muted-foreground/60 max-w-3xl">
          ما با افتخار به عنوان یک فروشگاه آنلاین معتبر و تخصصی در زمینه لوازم آرایشی، بهداشتی، عطر، لباس،
          کیف و کفش فعالیت می‌کنیم. ولوت رز با هدف ارائه بهترین محصولات با کیفیت و قیمت مناسب، تنها شش ماه است
          که آغاز به کار کرده است و در این مدت کوتاه توانسته‌ایم به یکی از مقاصد محبوب خریداران آنلاین تبدیل شویم.
        </p>
        <TheButton variant="secondary" class="text-primary w-fit" href="#contact" size="lg">
          ارتباط با ما
        </TheButton>
      </div>

      <figure class="w-full lg:w-1/2">
        <img src="/images/about/about-hero.png" alt="about-hero" class="w-full h-full object-cover"></img>
      </figure>
    </section>

    <!-- Why Us -->
    <section class="default-inner-container default-padding-x mb-20">
      <div class="mb-10">
        <h3 class="heading-6 text-primary/50 font-semibold text-center mb-2.5">
          چرا ولوت رز بهترین انتخابه؟
        </h3>
        <h2 class="heading-4 text-primary text-center font-bold lg:text-4xl">
          مزیت های ولوت رز نسبت به رقبا
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3.5 gap-y-6">
        <div
          v-for="(item, index) in whyItems"
          :key="item.title + index"
          class="w-full border border-border rounded-2xl py-4 px-5"
        >
          <component :is="item.icon" class="size-16 block mx-auto mb-5" />
          <h5 class="body-1 text-primary font-bold! text-center mb-2.5">
            {{ item.title }}
          </h5>
          <p class="body-3 text-primary font-medium text-center opacity-50">
            {{ item.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="default-inner-container default-padding-x mb-24">
      <div class="flex flex-col lg:flex-row-reverse lg:items-center gap-10">
        <img
          src="/images/about/contact.png"
          alt="contact-us"
          class="w-full max-w-[27.5rem] mx-auto lg:mx-0 "
          loading="lazy"
        />
        <form class="flex-1" @submit.prevent="handleSubmit">
          <h3 class="heading-4 text-primary font-extrabold mb-2">
            ارتباط با ما
          </h3>
          <p class="heading-6 text-primary font-semibold opacity-50 mb-12">
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
              <Textarea v-model="form.description" class="h-12 px-4 lg:px-6" placeholder="توضیحات" rows="6" :aria-invalid="!!errors.description" />
              <p v-if="errors.description" class="caption-2 text-destructive mt-1">{{ errors.description }}</p>
            </div>
          </div>

          <TheButton type="submit" size="lg" class="rounded-2xl px-8">
            ثبت درخواست
          </TheButton>
        </form>
      </div>
    </section>
  </div>
  
</template>

<script lang="ts" setup>
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Speed from '@/assets/icons/speed.svg?component'
import Direct from '@/assets/icons/direct.svg?component'
import Quality from '@/assets/icons/diamond.svg?component'
import Support from '@/assets/icons/support.svg?component'

type WhyItem = {
  icon: any
  title: string
  description: string
}

const whyItems: WhyItem[] = [
  {
    icon: Speed,
    title: 'واردات مستقیم و بدون واسطه',
    description:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است',
  },
  {
    icon: Direct,
    title: 'واردات مستقیم و بدون واسطه',
    description:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است',
  },
  {
    icon: Quality,
    title: 'واردات مستقیم و بدون واسطه',
    description:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است',
  },
  {
    icon: Support,
    title: 'واردات مستقیم و بدون واسطه',
    description:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است',
  },
]

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

const validate = () => {
  errors.name = form.name ? '' : 'نام را وارد کنید'
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'ایمیل معتبر نیست'
  errors.subject = form.subject ? '' : 'موضوع را وارد کنید'
  errors.description = form.description ? '' : 'توضیحات را وارد کنید'
  return !errors.name && !errors.email && !errors.subject && !errors.description
}

const handleSubmit = () => {
  if (!validate()) return
  // TODO: send to API when available
  console.log('about/contact form submit', { ...form })
}
</script>

<style>
</style>