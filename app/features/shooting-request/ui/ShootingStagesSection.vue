<script setup lang="ts">
import type { ShootingStageItem } from '@features/shooting-request/model/shooting-page.types'
import ShootingStageCard from '@features/shooting-request/ui/ShootingStageCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'

defineProps<{
  title: string
  stages: ShootingStageItem[]
}>()

const sectionRef = useTemplateRef<HTMLElement>('section')
const pinRef = useTemplateRef<HTMLElement>('pin')
const trackRef = useTemplateRef<HTMLElement>('track')

const isPinned = shallowRef(false)
const isComplete = shallowRef(false)
const isReducedMotion = shallowRef(false)
const sceneOffset = shallowRef(0)
const trackOffset = shallowRef(0)

const sceneClass = computed(() => {
  if (isPinned.value) return 'md:fixed md:inset-0 md:z-20'
  if (isComplete.value) return 'md:absolute md:inset-x-0 md:top-0'
  return 'md:relative'
})

const sceneStyle = computed(() => isComplete.value
  ? { transform: `translate3d(0, ${sceneOffset.value}px, 0)` }
  : undefined)

const trackStyle = computed(() => ({ transform: `translate3d(${trackOffset.value}px, 0, 0)` }))

const updateStages = () => {
  const section = sectionRef.value
  const pin = pinRef.value
  const track = trackRef.value
  if (!section || !pin || !track || window.innerWidth < 768 || isReducedMotion.value) {
    isPinned.value = false
    isComplete.value = false
    sceneOffset.value = 0
    trackOffset.value = 0
    return
  }

  const sectionTop = section.getBoundingClientRect().top + window.scrollY
  const sectionBottom = sectionTop + section.offsetHeight
  const end = sectionBottom - window.innerHeight
  const progress = Math.min(Math.max((window.scrollY - sectionTop) / Math.max(end - sectionTop, 1), 0), 1)

  isPinned.value = window.scrollY >= sectionTop && window.scrollY <= end
  isComplete.value = window.scrollY > end
  sceneOffset.value = Math.max(pin.offsetHeight - window.innerHeight, 0)
  trackOffset.value = window.innerWidth + (-track.scrollWidth - window.innerWidth) * progress
}

let frameId: number | undefined
const scheduleUpdate = () => {
  if (frameId !== undefined) return
  frameId = window.requestAnimationFrame(() => {
    frameId = undefined
    updateStages()
  })
}

let motionQuery: MediaQueryList | undefined
const updateMotionPreference = () => {
  isReducedMotion.value = motionQuery?.matches ?? false
  scheduleUpdate()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  isReducedMotion.value = motionQuery.matches
  updateStages()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
  motionQuery.addEventListener('change', updateMotionPreference)
})

onBeforeUnmount(() => {
  if (frameId !== undefined) window.cancelAnimationFrame(frameId)
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  motionQuery?.removeEventListener('change', updateMotionPreference)
})
</script>

<template>
  <section
    id="stages"
    ref="section"
    class="relative bg-bg md:h-[420vh] md:min-h-[420vh]"
    :class="{ 'md:h-auto md:min-h-0': isReducedMotion }"
  >
    <div ref="pin" class="relative h-full min-h-0 md:min-h-screen">
      <div
        v-if="!isReducedMotion"
        class="relative hidden h-screen w-full overflow-hidden bg-bg md:block"
        :class="sceneClass"
        :style="sceneStyle"
      >
        <div class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
          <h2 class="font-display text-[clamp(8rem,20vw,24rem)] font-black uppercase leading-none tracking-[-0.03em] text-text">
            {{ title }}
          </h2>
        </div>

        <div class="absolute inset-x-0 bottom-0 top-32 z-10 overflow-hidden">
          <div
            ref="track"
            class="flex h-[calc(100%_-_2rem)] w-max items-start gap-7 px-1.5 pb-8 will-change-transform"
            :style="trackStyle"
          >
            <template v-for="stage in stages" :key="stage.index">
              <ShootingStageCard :stage="stage" variant="summary" />
              <ShootingStageCard :stage="stage" variant="detail" />
            </template>
          </div>
        </div>
      </div>

      <div class="px-4 py-16 sm:px-6 md:hidden">
        <h2 class="mb-10 text-center font-display text-[clamp(80px,20vw,130px)] font-black uppercase leading-none tracking-[-0.03em] text-text">
          {{ title }}
        </h2>
        <LandingSlider :items-count="stages.length * 2" aria-label="Этапы участия в проекте">
          <template v-for="stage in stages" :key="stage.index">
            <ShootingStageCard :stage="stage" variant="summary" />
            <ShootingStageCard :stage="stage" variant="detail" />
          </template>
        </LandingSlider>
      </div>

      <div v-if="isReducedMotion" class="hidden overflow-x-auto px-10 py-20 md:block">
        <div class="flex w-max gap-7">
          <template v-for="stage in stages" :key="stage.index">
            <ShootingStageCard :stage="stage" variant="summary" />
            <ShootingStageCard :stage="stage" variant="detail" />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
