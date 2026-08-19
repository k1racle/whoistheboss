<script setup lang="ts">
const props = defineProps<{
  itemsCount: number
  ariaLabel?: string
  desktopTrackClass?: string
}>()

const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

const updateActiveIndex = () => {
  const track = trackRef.value
  if (!track) return

  const step = track.clientWidth
  if (!step) return

  activeIndex.value = Math.min(
    props.itemsCount - 1,
    Math.max(0, Math.round(track.scrollLeft / step)),
  )
}

onMounted(() => {
  updateActiveIndex()
  trackRef.value?.addEventListener('scroll', updateActiveIndex, { passive: true })
  window.addEventListener('resize', updateActiveIndex)
})

onBeforeUnmount(() => {
  trackRef.value?.removeEventListener('scroll', updateActiveIndex)
  window.removeEventListener('resize', updateActiveIndex)
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
      class="flex items-center gap-2 md:hidden"
      aria-hidden="true"
    >
      <span
        v-for="index in itemsCount"
        :key="index"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="activeIndex === index - 1 ? 'w-10 bg-accent' : 'w-4 bg-border-strong'"
      />
    </div>
  </div>
</template>
