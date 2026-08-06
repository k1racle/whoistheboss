<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  sectionId?: string
  ariaLabel?: string
}>(), {
  sectionId: undefined,
  ariaLabel: undefined,
})

defineSlots<{
  default(): unknown
}>()

const sectionRef = useTemplateRef<HTMLElement>('section')
const trackRef = useTemplateRef<HTMLElement>('track')

const isReducedMotion = shallowRef(false)
const sectionHeight = shallowRef(0)
const trackOffset = shallowRef(0)

const sectionStyle = computed(() => isReducedMotion.value || sectionHeight.value === 0
  ? undefined
  : { height: `${sectionHeight.value}px` })

const trackStyle = computed(() => ({ transform: `translate3d(${trackOffset.value}px, 0, 0)` }))

const updateTrack = () => {
  const section = sectionRef.value
  const track = trackRef.value
  if (!section || !track || isReducedMotion.value) {
    sectionHeight.value = 0
    trackOffset.value = 0
    return
  }

  const sectionTop = section.getBoundingClientRect().top + window.scrollY
  const travelDistance = track.scrollWidth + window.innerWidth
  const scrollDistance = Math.max(travelDistance, 1)
  const progress = Math.min(Math.max((window.scrollY - sectionTop) / scrollDistance, 0), 1)

  sectionHeight.value = window.innerHeight + scrollDistance
  trackOffset.value = window.innerWidth - travelDistance * progress
}

let frameId: number | undefined
const scheduleUpdate = () => {
  if (frameId !== undefined) return
  frameId = window.requestAnimationFrame(() => {
    frameId = undefined
    updateTrack()
  })
}

let motionQuery: MediaQueryList | undefined
let trackResizeObserver: ResizeObserver | undefined

watch(trackRef, (track) => {
  trackResizeObserver?.disconnect()
  if (track) trackResizeObserver?.observe(track)
  scheduleUpdate()
}, { flush: 'post' })

const updateMotionPreference = () => {
  isReducedMotion.value = motionQuery?.matches ?? false
  scheduleUpdate()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  isReducedMotion.value = motionQuery.matches
  updateTrack()

  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
  motionQuery.addEventListener('change', updateMotionPreference)

  trackResizeObserver = new ResizeObserver(scheduleUpdate)
  if (trackRef.value) trackResizeObserver.observe(trackRef.value)
})

onBeforeUnmount(() => {
  if (frameId !== undefined) window.cancelAnimationFrame(frameId)
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  motionQuery?.removeEventListener('change', updateMotionPreference)
  trackResizeObserver?.disconnect()
})
</script>

<template>
  <section
    :id="sectionId"
    ref="section"
    class="relative bg-bg"
    :aria-label="ariaLabel"
    :style="sectionStyle"
  >
    <div class="relative h-full min-h-0">
      <div
        v-if="!isReducedMotion"
        class="sticky top-0 block h-dvh w-full overflow-hidden bg-bg"
      >
        <div class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <h2 class="font-display text-[clamp(8rem,20vw,24rem)] font-black uppercase leading-none tracking-[-0.03em] text-text">
            {{ title }}
          </h2>
        </div>

        <div class="absolute inset-x-0 bottom-0 top-28 z-10 overflow-hidden md:top-32">
          <div
            ref="track"
            class="flex h-[calc(100%_-_2rem)] w-max items-start gap-5 px-1.5 pb-8 will-change-transform md:gap-7"
            :style="trackStyle"
          >
            <slot />
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto px-4 py-16 sm:px-6 md:px-10 md:py-20">
        <h2 class="mb-10 text-center font-display text-[clamp(80px,20vw,130px)] font-black uppercase leading-none tracking-[-0.03em] text-text">
          {{ title }}
        </h2>
        <div class="flex w-max gap-5 md:gap-7">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
