<template>
  <section ref="sectionRef" class="h-[80vh] w-full relative lg:cursor-none">
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
        به بهتریـــــــــــــــــــــــــــن نسخه از
      </span>
      <span class="text-nowrap">
        خودت تــــــــــــــــــــــــــــبدیل شو!
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
    <div v-if="isDesktop && isHovering" 
         ref="cursorRef" 
         class="absolute pointer-events-none z-10 rounded-full border-2 border-primary bg-transparent transition-opacity duration-200"
         :style="cursorStyle">
    </div>

    <!-- Mobile scroll indicator line -->
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const sectionRef = ref<HTMLElement | null>(null);
const frontImageRef = ref<HTMLImageElement | null>(null);
const cursorRef = ref<HTMLElement | null>(null);

const mouseX = ref(0);
const mouseY = ref(0);
const cursorX = ref(0);
const cursorY = ref(0);
const isHovering = ref(false);
const isDesktop = ref(false);

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
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

onMounted(() => {
  const section = sectionRef.value;
  const frontImage = frontImageRef.value;
  if (!section || !frontImage) return;

  // Client-side only check
  if (typeof window !== 'undefined') {
    isDesktop.value = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;

    if (isDesktop.value) {
      // Desktop hover effect with optimized mouse tracking
      const handleMouseMove = throttle((e: MouseEvent) => {
        const imgRect = frontImage.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        
        // Update mouse position relative to image
        mouseX.value = e.clientX - imgRect.left;
        mouseY.value = e.clientY - imgRect.top;
        
        // Update cursor position relative to section
        cursorX.value = e.clientX - sectionRect.left;
        cursorY.value = e.clientY - sectionRect.top;

        // Update CSS custom properties for mask
        frontImage.style.setProperty('--mouse-x', `${mouseX.value}px`);
        frontImage.style.setProperty('--mouse-y', `${mouseY.value}px`);
      }, 8); // ~120fps

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

      onUnmounted(() => {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseenter', handleMouseEnter);
        section.removeEventListener('mouseleave', handleMouseLeave);
        document.body.style.cursor = 'auto';
      });

    } else {
      // Mobile/tablet scroll-triggered reveal
      let ticking = false;
      
      const updateClip = () => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const trigger = viewportHeight / 2;
        
        let clipPercent = 0;
        
        if (rect.top < trigger && rect.bottom > trigger) {
          // Section is crossing the middle line
          const progress = (trigger - rect.top) / rect.height;
          clipPercent = Math.max(0, Math.min(100, progress * 100));
        } else if (rect.top >= trigger) {
          // Section is below the trigger line
          clipPercent = 0;
        } else {
          // Section is above the trigger line
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

      // Intersection Observer for performance optimization
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          window.addEventListener('scroll', handleScroll, { passive: true });
          updateClip(); // Initial update when element becomes visible
        } else {
          window.removeEventListener('scroll', handleScroll);
        }
      }, { 
        threshold: 0,
        rootMargin: '50px 0px' // Start observing 50px before the element
      });

      observer.observe(section);

      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      });
    }

    // Handle resize events
    const handleResize = throttle(() => {
      const newIsDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;
      if (newIsDesktop !== isDesktop.value) {
        // Reload component logic when switching between desktop/mobile
        window.location.reload();
      }
    }, 250);

    window.addEventListener('resize', handleResize);
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
  }
});
</script>

<style scoped>
.object {
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
  mask-image: radial-gradient(
    circle var(--radius) at var(--mouse-x) var(--mouse-y), 
    transparent 0, 
    transparent var(--radius), 
    black var(--radius)
  );
  -webkit-mask-image: radial-gradient(
    circle var(--radius) at var(--mouse-x) var(--mouse-y), 
    transparent 0, 
    transparent var(--radius), 
    black var(--radius)
  );
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