<template>
  <section ref="sectionRef" class="h-[80vh] w-full relative lg:cursor-none overflow-x-hidden">
    <h2
      class="hidden lg:flex flex-col heading-3 text-primary font-bold text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-5/6 z-1">
      <span class="text-nowrap">
        به بهتریــــــــــــــــــــــــــــــــــــــــــــــــن نسخه از
      </span>
      <span class="text-nowrap">
        خودت تــــــــــــــــــــــــــــــــــــــــــــــــــبدیل شو!
      </span>
    </h2>

    <h2
      class="flex flex-col lg:hidden heading-3 text-primary font-bold text-center absolute top-20 left-1/2 -translate-x-1/2 z-1">
      <span class="text-nowrap">
        به بهتریـــــــــــــــــــــــــــــــــــــــن نسخه از
      </span>
      <span class="text-nowrap">
        خودت تــــــــــــــــــــــــــــــــــــــــــبدیل شو!
      </span>
    </h2>

    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-4/6 rounded-full bg-secondary aspect-square object z-0">
    </div>

    <img src="/images/after.webp" alt="before-after"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 min-w-120 w-full lg:w-[50vw] h-[80%] object-contain z-2 object-bottom back-image" />

    <img ref="frontImageRef" src="/images/before.webp" alt="before-after"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 min-w-120 w-full lg:w-[50vw] h-[80%] object-contain z-3 object-bottom front-image"
      :class="{ 'reveal-mode': isDesktop && isHovering }" />
 
    <!-- Custom cursor for desktop -->
    <div v-if="isDesktop && isHovering" ref="cursorRef"
      class="absolute pointer-events-none z-10 rounded-full border-2 border-primary bg-transparent transition-opacity duration-200"
      :style="cursorStyle">
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';

const sectionRef = ref<HTMLElement | null>(null);
const frontImageRef = ref<HTMLImageElement | null>(null);
const cursorRef = ref<HTMLElement | null>(null);

const mouseX = ref(0);
const mouseY = ref(0);
const cursorX = ref(0);
const cursorY = ref(0);
const isHovering = ref(false);
const isDesktop = ref(false);

// Store cleanup functions
let cleanupFunctions: Array<() => void> = [];

// Computed style for cursor
const cursorStyle = computed(() => {
  const radius = 'clamp(4rem, 10vw, 8rem)';
  return {
    left: `${cursorX.value}px`,
    top: `${cursorY.value}px`,
    width: `calc(2 * ${radius})`,
    height: `calc(2 * ${radius})`,
    transform: 'translate(-50%, -50%)'
  };
});

// Throttle function for performance
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Clean up all event listeners and observers
const cleanup = () => {
  cleanupFunctions.forEach(fn => fn());
  cleanupFunctions = [];
  document.body.style.cursor = 'auto';
};

// Setup desktop interactions
const setupDesktop = () => {
  const section = sectionRef.value;
  const frontImage = frontImageRef.value;
  if (!section || !frontImage) return;

  const handleMouseMove = throttle((e: MouseEvent) => {
    const imgRect = frontImage.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();

    mouseX.value = e.clientX - imgRect.left;
    mouseY.value = e.clientY - imgRect.top;
    cursorX.value = e.clientX - sectionRect.left;
    cursorY.value = e.clientY - sectionRect.top;

    frontImage.style.setProperty('--mouse-x', `${mouseX.value}px`);
    frontImage.style.setProperty('--mouse-y', `${mouseY.value}px`);
  }, 8);

  const handleMouseEnter = () => {
    isHovering.value = true;
    document.body.style.cursor = 'none';
  };

  const handleMouseLeave = () => {
    isHovering.value = false;
    document.body.style.cursor = 'auto';
  };

  section.addEventListener('mousemove', handleMouseMove);
  section.addEventListener('mouseenter', handleMouseEnter);
  section.addEventListener('mouseleave', handleMouseLeave);

  // Store cleanup functions
  cleanupFunctions.push(
    () => section.removeEventListener('mousemove', handleMouseMove),
    () => section.removeEventListener('mouseenter', handleMouseEnter),
    () => section.removeEventListener('mouseleave', handleMouseLeave)
  );
};

// Setup mobile interactions
const setupMobile = () => {
  const section = sectionRef.value;
  const frontImage = frontImageRef.value;
  if (!section || !frontImage) return;

  let ticking = false;

  const updateClip = () => {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const trigger = viewportHeight / 2;

    let clipPercent = 0;

    if (rect.top < trigger && rect.bottom > trigger) {
      const progress = (trigger - rect.top) / rect.height;
      clipPercent = Math.max(0, Math.min(100, progress * 100));
    } else if (rect.top >= trigger) {
      clipPercent = 0;
    } else {
      clipPercent = 100;
    }

    frontImage.style.setProperty('--clip', `${clipPercent}%`);
    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateClip);
      ticking = true;
    }
  };

  // Initial calculation
  updateClip();

  const observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      updateClip();
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
  }, {
    threshold: 0,
    rootMargin: '50px 0px'
  });

  observer.observe(section);

  // Store cleanup functions
  cleanupFunctions.push(
    () => window.removeEventListener('scroll', handleScroll),
    () => observer.disconnect()
  );
};

// Initialize interactions based on device type
const initializeInteractions = async () => {
  // Clean up existing interactions
  cleanup();

  // Wait for next tick to ensure DOM is ready
  await nextTick();

  // Check device type
  const newIsDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;
  isDesktop.value = newIsDesktop;

  // Reset states
  isHovering.value = false;

  // Reset image styles
  const frontImage = frontImageRef.value;
  if (frontImage) {
    frontImage.style.removeProperty('--mouse-x');
    frontImage.style.removeProperty('--mouse-y');
    frontImage.style.removeProperty('--clip');
  }

  // Setup appropriate interactions
  if (newIsDesktop) {
    setupDesktop();
  } else {
    setupMobile();
  }
};

onMounted(() => {
  if (typeof window === 'undefined') return;

  // Initial setup
  initializeInteractions();

  // Handle resize events with dynamic reinitialization
  const handleResize = throttle(async () => {
    const newIsDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;
    if (newIsDesktop !== isDesktop.value) {
      await initializeInteractions();
    }
  }, 250);

  window.addEventListener('resize', handleResize);

  // Store final cleanup
  cleanupFunctions.push(() => window.removeEventListener('resize', handleResize));
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.rounded-object {
  width: clamp(18rem, 25vw, 25rem);
}

.front-image {
  --radius: clamp(4rem, 10vw, 8rem);
  --mouse-x: 50%;
  --mouse-y: 50%;
  --clip: 0%;
}

/* Desktop reveal mode with circular mask */
.reveal-mode {
  mask-image: radial-gradient(circle var(--radius) at var(--mouse-x) var(--mouse-y),
      transparent 0,
      transparent var(--radius),
      black var(--radius));
  -webkit-mask-image: radial-gradient(circle var(--radius) at var(--mouse-x) var(--mouse-y),
      transparent 0,
      transparent var(--radius),
      black var(--radius));
}

/* Mobile/tablet scroll-triggered reveal */
@media (max-width: 1023px) {
  .front-image {
    clip-path: inset(var(--clip) 0 0 0);
    transition: clip-path 0.1s ease-out;
  }
}

/* Smooth transitions */
@media (min-width: 1024px) {
  .front-image {
    transition: mask-image 0.1s ease-out;
  }
}
</style>