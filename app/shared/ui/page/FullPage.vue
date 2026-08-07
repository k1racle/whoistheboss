<script setup lang="ts">

const props = withDefaults(defineProps<{
  as?: string
  nextLabel?: string
  offsetSelector?: string
  minHeight?: number
}>(), {
  as: 'section',
  nextLabel: 'Перейти к следующему блоку',
  offsetSelector: 'header',
  minHeight: 560,
})

const rootRef = ref<HTMLElement | null>(null)
const viewportHeight = ref(0)
const offsetHeight = ref(0)
const touchStartY = ref<number | null>(null)
const isAnimating = ref(false)

const updateMetrics = () => {
  viewportHeight.value = window.visualViewport?.height ?? window.innerHeight
  offsetHeight.value = document.querySelector(props.offsetSelector)?.getBoundingClientRect().height ?? 0
}

const nextSection = computed(() => {
  const section = rootRef.value
  if (!section) return null

  return (section.nextElementSibling ?? section.parentElement?.nextElementSibling) as HTMLElement | null
})

const sectionStyle = computed(() => {
  if (!viewportHeight.value) return undefined

  return {
    minHeight: `${Math.max(viewportHeight.value - offsetHeight.value, props.minHeight)}px`,
  }
})

const isActiveSection = () => {
  const section = rootRef.value
  if (!section) return false

  const rect = section.getBoundingClientRect()
  const threshold = offsetHeight.value + 40

  return rect.top <= threshold && rect.bottom >= viewportHeight.value * 0.6
}

const releaseAnimationLock = () => {
  window.setTimeout(() => {
    isAnimating.value = false
  }, 700)
}

const scrollToNext = () => {
  if (!nextSection.value || isAnimating.value) return

  const nextTop = nextSection.value.getBoundingClientRect().top + window.scrollY
  const targetTop = Math.max(nextTop - offsetHeight.value + 1, 0)

  isAnimating.value = true
  window.scrollTo({
    top: targetTop,
    behavior: 'smooth',
  })

  releaseAnimationLock()
}

const handleWheel = (event: WheelEvent) => {
  if (event.deltaY <= 14 || !isActiveSection() || !nextSection.value) return

  event.preventDefault()
  scrollToNext()
}

const handleTouchStart = (event: TouchEvent) => {
  touchStartY.value = event.changedTouches[0]?.clientY ?? null
}

const handleTouchEnd = (event: TouchEvent) => {
  const startY = touchStartY.value
  const endY = event.changedTouches[0]?.clientY ?? null

  touchStartY.value = null

  if (startY === null || endY === null || !isActiveSection() || !nextSection.value) return
  if (startY - endY < 48) return

  scrollToNext()
}

onMounted(() => {
  updateMetrics()
  window.addEventListener('resize', updateMetrics)
  window.visualViewport?.addEventListener('resize', updateMetrics)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMetrics)
  window.visualViewport?.removeEventListener('resize', updateMetrics)
})
</script>

<template>
  <component
    :is="as"
    ref="rootRef"
    class="relative flex flex-col justify-between overflow-hidden"
    :style="sectionStyle"
    @touchend="handleTouchEnd"
    @touchstart.passive="handleTouchStart"
    @wheel="handleWheel"
  >
    <slot />
  </component>
</template>
