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
        <TheButton variant="secondary" class="text-primary w-fit" to="/contact" size="lg">
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
  </div>
  
</template>

<script lang="ts" setup>
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

</script>

<style>
</style>