<script setup lang="ts">
import {
  getCenteredSlideScrollLeft,
  getClosestSlideIndex,
} from '@features/landing/model/slider-navigation'

const props = defineProps<{
  itemsCount: number
  ariaLabel?: string
  desktopTrackClass?: string
}>()

const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const getSlideMetric = (track: HTMLElement, slide: HTMLElement) => {
  const trackRect = track.getBoundingClientRect()
  const slideRect = slide.getBoundingClientRect()

  return {
    offsetLeft: slideRect.left - trackRect.left + track.scrollLeft,
    offsetWidth: slideRect.width,
  }
}

const updateActiveIndex = () => {
  const track = trackRef.value
  if (!track) return

  activeIndex.value = getClosestSlideIndex(
    Array.from(track.children).map(child => getSlideMetric(track, child as HTMLElement)),
    track.scrollLeft,
    track.clientWidth,
    props.itemsCount,
  )
}

let frameId: number | undefined
const scheduleActiveIndexUpdate = () => {
  if (frameId !== undefined) return

  frameId = window.requestAnimationFrame(() => {
    frameId = undefined
    updateActiveIndex()
  })
}

const scrollToIndex = (index: number) => {
  const track = trackRef.value
  const slide = track?.children.item(index) as HTMLElement | null
  if (!track || !slide) return

  track.scrollTo({
    left: getCenteredSlideScrollLeft(getSlideMetric(track, slide), track.clientWidth),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  updateActiveIndex()
  trackRef.value?.addEventListener('scroll', scheduleActiveIndexUpdate, { passive: true })
  window.addEventListener('resize', scheduleActiveIndexUpdate)
})

onBeforeUnmount(() => {
  if (frameId !== undefined) window.cancelAnimationFrame(frameId)
  trackRef.value?.removeEventListener('scroll', scheduleActiveIndexUpdate)
  window.removeEventListener('resize', scheduleActiveIndexUpdate)
})
</script>

<template>
  <div class="space-y-5">
    <div
      ref="trackRef"
      class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 pt-2.5 [scrollbar-width:none] md:snap-none md:overflow-visible md:pb-0 md:pt-0 [&::-webkit-scrollbar]:hidden"
      :class="desktopTrackClass"
      :role="ariaLabel ? 'region' : undefined"
      :aria-label="ariaLabel"
    >
      <slot />
    </div>

    <div
      v-if="itemsCount > 1"
      class="flex items-center md:hidden"
      aria-label="Навигация по слайдам"
    >
      <button
        v-for="index in itemsCount"
        :key="index"
        type="button"
        class="flex h-11 touch-manipulation items-center justify-center px-1"
        :aria-label="`Перейти к слайду ${index}`"
        :aria-current="activeIndex === index - 1 ? 'true' : undefined"
        @click="scrollToIndex(index - 1)"
      >
        <span
          aria-hidden="true"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="activeIndex === index - 1 ? 'w-10 bg-accent' : 'w-4 bg-border-strong'"
        />
      </button>
    </div>
  </div>
</template>
