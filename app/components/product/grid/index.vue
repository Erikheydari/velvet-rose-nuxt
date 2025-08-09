<template>
  <section class="lg-inner-container default-padding-x w-full">
    <div class="product-filter flex justify-between mb-4 lg:mb-8 relative">
      <div class="flex gap-2 w-full justify-between items-center">
        <Transition name="fade" mode="out-in">
          <h1 class="body-2" :key="categoryTitleKey">{{ categoryTitle }}</h1>
        </Transition>

        <div class="category-filter flex gap-2 w-full max-w-xs">
          <Select v-model="selectedCategoryFilter" @update:model-value="onCategoryModelUpdate">
            <SelectTrigger class="w-full" :disabled="productsStore.isLoading"
              :class="{ 'opacity-50!': productsStore.isLoading }">
              <Loader2 v-if="productsStore.isLoading" class="size-4 animate-spin" />
              <SelectValue placeholder="همه دسته‌بندی‌ها" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>دسته‌بندی</SelectLabel>
                <SelectItem :disabled="selectedCategoryFilter === 'all' || selectedCategoryFilter === null" value="all">
                  همه
                </SelectItem>
                <SelectItem v-for="category in categories" :key="category.slug" :value="category.slug"
                  :disabled="selectedCategoryFilter === category.slug">
                  {{ category.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <TheButton v-if="selectedCategoryFilter && selectedCategoryFilter !== 'all'" variant="ghost"
            @click="clearCategoryFilter">
            <Trash class="size-4" />
          </TheButton>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <TransitionGroup v-if="!productsStore.isLoading" tag="div" class="product-grid" :css="false" aria-busy="false"
      @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
      <slot />
    </TransitionGroup>

    <!-- Skeletons while loading -->
    <SkeletonProductGrid v-else :count="skeletonCount" />
  </section>
</template>

<script lang="ts" setup>
import { Loader2, Trash } from 'lucide-vue-next';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '~/components/ui/select';
import { useCategoriesStore } from '~/stores/categories';

const categoriesStore = useCategoriesStore();
const categories = computed(() => categoriesStore.categories);
const productsStore = useProductsStore();

const selectedCategoryFilter = ref<string | null>(null);
const skeletonCount = 8;

const clearCategoryFilter = async () => {
  selectedCategoryFilter.value = null;
  await productsStore.fetchProducts();
  categoriesStore.category = null;
};

const fetchProductsByCategory = async (categorySlug: string) => {
  if (categorySlug === 'all') {
    await productsStore.fetchProducts();
    categoriesStore.category = null;
    return;
  }

  await productsStore.fetchProductsByCategory(categorySlug);
  const categoryId = categories.value.find(category => category.slug === categorySlug)?.id;
  if (categoryId) {
    await categoriesStore.fetchCategoryById(categoryId);
  }
};

const onCategoryModelUpdate = async (value: unknown) => {
  const normalized: string | null = value == null ? null : String(value);
  if (normalized === null || normalized === 'all') {
    await productsStore.fetchProducts();
    categoriesStore.category = null;
    return;
  }
  await fetchProductsByCategory(normalized);
};

const categoryTitle = computed(() => {
  const selected = categoriesStore.categories.find(category => category.slug === selectedCategoryFilter.value);
  if (!selectedCategoryFilter.value || selectedCategoryFilter.value === 'all') {
    return 'همه محصولات';
  }
  return selected?.name ?? 'همه محصولات';
});

const categoryTitleKey = computed(() => selectedCategoryFilter.value ?? 'all');

const onBeforeEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.opacity = '0';
  element.style.transform = 'translateY(8px)';
};

const onEnter = (el: Element, done: () => void) => {
  const element = el as HTMLElement;

  // Respect reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.style.opacity = '1';
    element.style.transform = '';
    done();
    return;
  }

  const parent = element.parentElement;
  const index = parent ? Array.from(parent.children).indexOf(element) : 0;
  const delay = Math.min(index * 60, 480);

  element.style.transition = 'opacity 300ms ease, transform 300ms ease';

  const start = window.setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, delay);

  const end = window.setTimeout(() => {
    element.style.transition = '';
    done();
  }, delay + 320);

  (element as any)._staggerTimers = [start, end];
};

const onLeave = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  element.style.transition = 'opacity 200ms ease, transform 200ms ease';
  element.style.opacity = '0';
  element.style.transform = 'translateY(4px)';
  window.setTimeout(() => done(), 200);
};
</script>

<style scoped>
@import '~/assets/css/tailwind.css';

.product-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 items-stretch;
}
</style>