<template>
  <section class="lg-inner-container default-padding-x w-full">
    <slot name="header" />
    <div class="product-filter flex justify-between mb-4 lg:mb-8 relative">
      <div class="flex flex-col sm:flex-row gap-2 w-full justify-between items-center">
        <Transition name="fade" mode="out-in">
          <div class="flex items-baseline gap-2 w-full sm:w-auto">
            <h1 v-if="!loading" class="heading-5 text-primary font-bold" :key="categoryTitleKey">{{ title || categoryTitle }}</h1>
            <TheSkeleton v-else class="w-34 h-10" />
            <TheButton v-if="selectedCategoryFilter" variant="link" size="sm"
              :to="`/products/${selectedCategoryFilter}`">
              مشاهده همه
              <ArrowLeft class="size-3" />
            </TheButton>
          </div>
        </Transition>

        <div v-if="filterable" class="category-filter flex gap-2 w-full max-w-ful;l lg:max-w-xs">
          <Select v-model="selectedCategoryFilter" @update:model-value="onCategoryModelUpdate">
            <SelectTrigger class="w-full" :disabled="loading" :class="{ 'opacity-50!': loading }">
              <Loader2 v-if="loading" class="size-4 animate-spin" />
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
    <template v-if="!loading">
      <TransitionGroup tag="div" class="product-grid" :css="false" aria-busy="false"
        @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
        <slot />
      </TransitionGroup>
      
      <!-- Empty state when no products -->
      <div v-if="hasEmptySlot" class="col-span-full">
        <slot name="empty">
          <ProductEmpty class="py-16" />
        </slot>
      </div>
    </template>

    <!-- Skeletons while loading -->
    <SkeletonProductGrid v-else :count="skeletonCount" />

    <!-- Pagination slot at bottom -->
    <div class="mt-8">
      <slot name="pagination" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ArrowLeft, Loader2, Trash } from 'lucide-vue-next';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '~/components/ui/select';
import { useCategoriesStore } from '~/stores/categories';

const categoriesStore = useCategoriesStore();
const categories = computed(() => categoriesStore.categories);
const productsStore = useProductsStore();

const slots = useSlots();

interface Props {
  filterable?: boolean;
  title?: string;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  filterable: true,
  title: '',
  loading: true,
});

const selectedCategoryFilter = ref<string | null>(null);
const skeletonCount = 8;

// Check if the default slot is empty (no products)
const hasEmptySlot = computed(() => {
  if (props.loading) return false;
  const defaultSlot = slots.default?.();
  return !defaultSlot || defaultSlot.length === 0 || 
    (defaultSlot.length === 1 && !defaultSlot[0]?.children);
});

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