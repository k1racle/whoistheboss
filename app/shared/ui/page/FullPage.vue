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

const getNextSection = () => {
  const section = rootRef.value
  if (!section) return null

  const parent = section.parentElement
  if (!parent) return null

  const visualSiblings = Array.from(parent.children)
    .filter((element): element is HTMLElement => element instanceof HTMLElement)
    .map((element, domIndex) => {
      const parsedOrder = Number.parseFloat(window.getComputedStyle(element).order)

      return {
        element,
        domIndex,
        order: Number.isFinite(parsedOrder) ? parsedOrder : 0,
      }
    })
    .sort((left, right) => left.order - right.order || left.domIndex - right.domIndex)

  const currentIndex = visualSiblings.findIndex(item => item.element === section)

  return currentIndex >= 0
    ? visualSiblings[currentIndex + 1]?.element ?? null
    : null
}

const sectionStyle = computed(() => ({
  '--full-page-min-height': `${props.minHeight}px`,
}))

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

const scrollToNext = (nextSection: HTMLElement) => {
  if (isAnimating.value) return

  const nextTop = nextSection.getBoundingClientRect().top + window.scrollY
  const targetTop = Math.max(nextTop - offsetHeight.value + 1, 0)

  isAnimating.value = true
  window.scrollTo({
    top: targetTop,
    behavior: 'smooth',
  })

  releaseAnimationLock()
}

const handleWheel = (event: WheelEvent) => {
  const nextSection = getNextSection()
  if (event.deltaY <= 14 || !isActiveSection() || !nextSection) return

  event.preventDefault()
  scrollToNext(nextSection)
}

const handleTouchStart = (event: TouchEvent) => {
  touchStartY.value = event.changedTouches[0]?.clientY ?? null
}

const handleTouchEnd = (event: TouchEvent) => {
  const startY = touchStartY.value
  const endY = event.changedTouches[0]?.clientY ?? null

  touchStartY.value = null

  const nextSection = getNextSection()
  if (startY === null || endY === null || !isActiveSection() || !nextSection) return
  if (startY - endY < 48) return

  scrollToNext(nextSection)
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
    class="full-page relative flex flex-col justify-between overflow-hidden"
    :style="sectionStyle"
    @touchend="handleTouchEnd"
    @touchstart.passive="handleTouchStart"
    @wheel="handleWheel"
  >
    <slot />
  </component>
</template>

<style scoped>
.full-page {
  --full-page-header-height: 4rem;

  min-height: max(
    var(--full-page-min-height),
    calc(100svh - var(--full-page-header-height))
  );
  min-height: max(
    var(--full-page-min-height),
    calc(100dvh - var(--full-page-header-height))
  );
}

@media (min-width: 64rem) {
  .full-page {
    --full-page-header-height: 4.75rem;
  }
}
</style>
