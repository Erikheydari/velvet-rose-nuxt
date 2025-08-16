import { ref, computed, watch, type Ref } from 'vue'

export interface SlidePanelOptions {
  minHeight?: number // Minimum height in vh (default: 80)
  maxHeight?: number // Maximum height in vh (default: 100)
  closeThreshold?: number // Threshold to close panel when dragging down (default: 30)
  snapThreshold?: number // Threshold for snapping to positions (default: 10)
  onClose?: () => void // Callback when panel should close
}

export function useSlidePanel(
  isActive: Ref<boolean>,
  options: SlidePanelOptions = {}
) {
  const {
    minHeight = 80,
    maxHeight = 100,
    closeThreshold = 30,
    snapThreshold = 10,
    onClose
  } = options

  // Touch handling states
  const touchStartY = ref(0)
  const touchCurrentY = ref(0)
  const isDragging = ref(false)
  const currentHeight = ref(minHeight)
  const isTransitioning = ref(false)

  // Computed style for panel
  const panelStyle = computed(() => {
    if (!isActive.value) return {}

    let transform = 0
    let height = `${currentHeight.value}vh`

    // During drag, apply transform based on touch movement
    if (isDragging.value && touchStartY.value) {
      const dragDistance = touchCurrentY.value - touchStartY.value
      const viewportHeight = window.innerHeight
      const vhDistance = (dragDistance / viewportHeight) * 100

      // Apply constraints based on current state
      if (currentHeight.value === minHeight) {
        if (vhDistance > 0) {
          // Dragging down when minimized - prepare to close
          transform = Math.min(vhDistance, minHeight)
        } else if (vhDistance < 0) {
          // Dragging up when minimized - expand
          const newHeight = Math.min(minHeight - vhDistance, maxHeight)
          height = `${newHeight}vh`
        }
      } else if (currentHeight.value === maxHeight) {
        if (vhDistance > 0) {
          // Dragging down when maximized - shrink
          const newHeight = Math.max(maxHeight - vhDistance, minHeight)
          height = `${newHeight}vh`
        }
      }
    }

    return {
      height,
      transform: transform > 0 ? `translateY(${transform}vh)` : 'translateY(0)',
      transition: isTransitioning.value ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
    }
  })

  // Touch event handlers
  const handleTouchStart = (event: TouchEvent) => {
    if (!isActive.value) return

    isDragging.value = true
    isTransitioning.value = false
    touchStartY.value = event.touches[0]?.clientY || 0
    touchCurrentY.value = event.touches[0]?.clientY || 0
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging.value || !isActive.value) return

    event.preventDefault()
    touchCurrentY.value = event.touches[0]?.clientY || 0
  }

  const handleTouchEnd = () => {
    if (!isDragging.value || !isActive.value) return

    isDragging.value = false
    isTransitioning.value = true

    const dragDistance = touchCurrentY.value - touchStartY.value
    const viewportHeight = window.innerHeight
    const vhDistance = (dragDistance / viewportHeight) * 100

    // Determine final state based on drag direction and distance
    if (currentHeight.value === minHeight) {
      if (vhDistance > closeThreshold) {
        // Close the panel
        onClose?.()
      } else if (vhDistance < -snapThreshold) {
        // Expand to full height
        animateToHeight(maxHeight)
      } else {
        // Snap back to minimized
        animateToHeight(minHeight)
      }
    } else if (currentHeight.value === maxHeight) {
      if (vhDistance > snapThreshold) {
        // Minimize to minHeight
        animateToHeight(minHeight)
      } else {
        // Snap back to maximized
        animateToHeight(maxHeight)
      }
    }

    // Reset touch values
    touchStartY.value = 0
    touchCurrentY.value = 0
  }

  // Animate height change
  const animateToHeight = (height: number) => {
    currentHeight.value = height

    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }

  // Reset height when opened/closed
  watch(isActive, (active) => {
    if (active) {
      currentHeight.value = minHeight
      isTransitioning.value = false
    }
  })

  // Touch event bindings for the panel
  const panelTouchHandlers = {
    onTouchstart: handleTouchStart,
    onTouchmove: handleTouchMove,
    onTouchend: handleTouchEnd,
    onTouchcancel: handleTouchEnd
  }

  // Touch event bindings for the handle bar
  const handleBarTouchHandlers = {
    onTouchstart: (e: TouchEvent) => {
      e.stopPropagation()
      handleTouchStart(e)
    },
    onTouchmove: (e: TouchEvent) => {
      e.stopPropagation()
      handleTouchMove(e)
    },
    onTouchend: (e: TouchEvent) => {
      e.stopPropagation()
      handleTouchEnd()
    }
  }

  return {
    // States
    isDragging,
    currentHeight,
    isTransitioning,
    
    // Computed
    panelStyle,
    
    // Methods
    animateToHeight,
    
    // Event handlers
    panelTouchHandlers,
    handleBarTouchHandlers
  }
}