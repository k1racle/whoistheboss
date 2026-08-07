<script setup lang="ts">
import {
  landingAudienceFallback,
  type LandingAudienceCard,
} from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import AudienceCard from '@features/landing/ui/audience/AudienceCard.vue'

const props = defineProps<{
  title: string
  intro: string
  cards?: LandingAudienceCard[]
  sectionId?: string
}>()

const titleLines = computed(() => props.title.split('\n'))
const desktopTitle = computed(() => props.title.replace(/\n/g, ' '))

const SLOT_POSITIONS = [
  [0, 0],
  [2, 1],
  [1, 2],
  [3, 3],
  [1, 4],
  [0, 5],
  [3, 5],
] as const

const LIGHT_SLOTS = new Set([1, 2, 5, 7])

const sectionRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)

const isDesktop = shallowRef(false)

const cards = computed<LandingAudienceCard[]>(() =>
  props.cards?.length ? props.cards : [...landingAudienceFallback],
)

const desktopCards = computed(() => cards.value.slice(0, SLOT_POSITIONS.length))

const isPinned = ref(false)
const isComplete = ref(false)
const isFinal = ref(false)
const isActiveFlow = ref(false)
const sceneOffset = ref(0)
const stageOffset = ref(0)

const scenePositionClass = computed(() => {
  const position = isComplete.value
    ? 'lg:absolute lg:inset-x-0 lg:top-0'
    : isPinned.value
      ? 'lg:fixed lg:inset-0 lg:z-20'
      : 'lg:relative'
  return `relative ${position}`
})

const sceneStyle = computed(() =>
  isDesktop.value && isComplete.value
    ? { transform: `translate3d(0, ${sceneOffset.value}px, 0)` }
    : {},
)

const stageStyle = computed(() => ({
  gridTemplateColumns: 'repeat(4, 25vw)',
  gridAutoRows: '25vw',
  transform: `translate3d(0, ${stageOffset.value}px, 0)`,
}))

const slotStyle = (index: number) => {
  const [column, row] = SLOT_POSITIONS[index % SLOT_POSITIONS.length]!
  return {
    gridColumn: `${column + 1} / ${column + 2}`,
    gridRow: `${row + 1} / ${row + 2}`,
  }
}

const slotVariant = (index: number): 'light' | 'accent' => {
  const slot = (index % SLOT_POSITIONS.length) + 1
  return LIGHT_SLOTS.has(slot) ? 'light' : 'accent'
}

const updateAudience = () => {
  isDesktop.value = window.matchMedia('(min-width: 1024px)').matches

  const section = sectionRef.value
  const scene = sceneRef.value
  const stage = stageRef.value
  if (!isDesktop.value || !section || !scene || !stage) {
    isPinned.value = false
    isComplete.value = false
    isActiveFlow.value = false
    isFinal.value = false
    sceneOffset.value = 0
    stageOffset.value = 0
    return
  }

  const sectionRect = section.getBoundingClientRect()
  const sectionTop = sectionRect.top + window.scrollY
  const sectionBottom = sectionTop + section.offsetHeight
  const viewportHeight = window.innerHeight
  const start = sectionTop
  const end = sectionBottom - viewportHeight
  const y = window.scrollY
  const progress = Math.min(Math.max((y - start) / Math.max(end - start, 1), 0), 1)
  const active = y >= start && y <= end
  const complete = y > end

  isPinned.value = active
  isComplete.value = complete
  isActiveFlow.value = active || complete
  isFinal.value = progress >= 0.98
  sceneOffset.value = section.offsetHeight - viewportHeight
  stageOffset.value = viewportHeight - (stage.offsetHeight + viewportHeight) * progress
}

let rafId: number | null = null
const scheduleUpdate = () => {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(() => {
    rafId = null
    updateAudience()
  })
}

onMounted(() => {
  updateAudience()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
})

onBeforeUnmount(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
})
</script>

<template>
  <section
    :id="sectionId || 'for-whom'"
    ref="sectionRef"
    class="relative bg-bg lg:min-h-[320vh]"
  >
    <div class="relative lg:h-screen lg:min-h-screen">
      <div
        ref="sceneRef"
        class="relative overflow-visible bg-bg lg:h-screen lg:overflow-hidden"
        :class="scenePositionClass"
        :style="sceneStyle"
      >
        <div class="mx-auto w-full max-w-[1920px] px-4 pt-14 sm:px-6 lg:hidden">
          <div class="ml-auto max-w-[620px]">
            <p class="font-sans text-sm leading-6 text-text/78 sm:text-base">
              {{ intro }}
            </p>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-[1920px] px-4 pb-14 sm:px-6 lg:hidden">
          <div class="pointer-events-none sticky top-0 z-0 flex h-svh items-center justify-center">
            <h2 class="mx-auto flex w-fit flex-col items-center text-center font-display text-[clamp(72px,21vw,96px)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-text">
              <span
                v-for="line in titleLines"
                :key="line"
              >
                {{ line }}
              </span>
            </h2>
          </div>

          <div class="relative z-10 -mt-[100svh] flex flex-col gap-5 py-[45svh]">
            <AudienceCard
              v-for="(card, index) in cards"
              :key="card.id"
              :card="card"
              :variant="index % 2 === 0 ? 'accent' : 'light'"
              class="aspect-square w-[85%]"
              :class="index % 2 === 0 ? 'ml-auto' : 'mr-auto'"
            />
          </div>
        </div>

        <div class="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center lg:flex">
          <h2
            class="font-display text-[clamp(5rem,13vw,12rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text transition-[opacity,transform] duration-300"
            :class="isFinal ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'"
          >
            {{ desktopTitle }}
          </h2>
        </div>

        <div
          ref="stageRef"
          class="absolute inset-x-0 top-0 z-10 hidden h-[150vw] will-change-transform transition-opacity duration-200 lg:grid"
          :class="isActiveFlow ? 'opacity-100' : 'opacity-0'"
          :style="stageStyle"
        >
          <AudienceCard
            v-for="(card, index) in desktopCards"
            :key="card.id"
            :card="card"
            :variant="slotVariant(index)"
            class="h-full w-full"
            :style="slotStyle(index)"
          />
        </div>

        <div
          class="absolute inset-0 z-20 hidden flex-col items-center justify-center gap-8 transition-[opacity,transform] duration-300 lg:flex"
          :class="isFinal ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'"
        >
          <h2 class="font-display text-[clamp(5rem,13vw,12rem)] font-black uppercase leading-[0.94] tracking-[-0.045em] text-text">
            Это про меня
          </h2>
          <ButtonLink
            :to="ROUTES.SHOOTING_REQUEST"
            arrow="none"
          >
            Стать участником
          </ButtonLink>
        </div>
      </div>
    </div>
  </section>
</template>
