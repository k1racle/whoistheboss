<script setup lang="ts">
import {
  landingAudienceFallback,
  landingAudienceIntro,
  type LandingAudienceCard,
} from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

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
const mobileTrackRef = ref<HTMLElement | null>(null)

const isDesktop = useMediaQuery('(min-width: 1024px)')

// TODO: загружать карточки аудитории с бэка (server/api/landing/audience-cards.get.ts → prisma.audienceCard).
// Пока возвращаем статический fallback, повторяющий legacy forWhoCards из migration_old/server/views/index.ejs.
const cards: LandingAudienceCard[] = [...landingAudienceFallback]

const desktopCards = computed(() => cards.slice(0, SLOT_POSITIONS.length))

const activeIndex = ref(0)
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
  isComplete.value ? { transform: `translate3d(0, ${sceneOffset.value}px, 0)` } : {},
)

const stageStyle = computed(() => ({
  '--audience-col-width': '25vw',
  transform: `translate3d(0, ${stageOffset.value}px, 0)`,
}))

const slotStyle = (index: number) => {
  const [column, row] = SLOT_POSITIONS[index % SLOT_POSITIONS.length]!
  return {
    left: `calc(var(--audience-col-width) * ${column})`,
    top: `calc(var(--audience-col-width) * ${row})`,
  }
}

const slotTone = (index: number) => {
  const slot = (index % SLOT_POSITIONS.length) + 1
  return LIGHT_SLOTS.has(slot)
    ? 'border-border bg-surface/50 text-text hover:bg-accent hover:text-text-on-accent'
    : 'border-accent bg-accent text-text-on-accent hover:bg-surface/50 hover:text-text'
}

const updateAudience = () => {
  const section = sectionRef.value
  const scene = sceneRef.value
  const stage = stageRef.value
  if (!isDesktop.value || !section || !scene || !stage) return

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
  isFinal.value = progress >= 0.94
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

const updateMobileIndex = () => {
  const track = mobileTrackRef.value
  if (!track) return
  const step = track.clientWidth
  if (!step) return
  activeIndex.value = Math.min(
    cards.length - 1,
    Math.max(0, Math.round(track.scrollLeft / step)),
  )
}

onMounted(() => {
  updateAudience()
  updateMobileIndex()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
  mobileTrackRef.value?.addEventListener('scroll', updateMobileIndex, { passive: true })
})

onBeforeUnmount(() => {
  if (rafId !== null) window.cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
  mobileTrackRef.value?.removeEventListener('scroll', updateMobileIndex)
})
</script>

<template>
  <section
    id="for-whom"
    ref="sectionRef"
    class="relative bg-bg lg:min-h-[260vh]"
  >
    <div class="relative lg:h-screen lg:min-h-screen">
      <div
        ref="sceneRef"
        class="relative overflow-visible bg-bg lg:h-screen lg:overflow-hidden"
        :class="scenePositionClass"
        :style="sceneStyle"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-4 py-14 sm:px-6 lg:hidden">
          <div class="max-w-[620px] space-y-8">
            <p class="font-sans text-sm leading-6 text-text/78 sm:text-base">
              {{ landingAudienceIntro }}
            </p>
            <h2 class="font-display text-[clamp(3.5rem,16vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] text-text">
              <span class="block w-1/2 text-right">ДЛЯ</span>
              <span class="block w-1/2 pl-2 text-left">КОГО</span>
            </h2>
          </div>

          <div class="space-y-5">
            <div
              ref="mobileTrackRef"
              class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="Карточки аудитории"
            >
              <article
                v-for="card in cards"
                :key="card.id"
                class="flex min-w-[85%] snap-center flex-col justify-between border border-border bg-surface p-5"
              >
                <h3 class="font-display text-[clamp(2rem,8vw,3rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
                  {{ card.title }}
                </h3>
                <p
                  v-if="card.description"
                  class="mt-4 font-sans text-sm leading-5 text-text/72"
                >
                  {{ card.description }}
                </p>
              </article>
            </div>

            <div
              class="flex items-center gap-2"
              aria-hidden="true"
            >
              <span
                v-for="(card, index) in cards"
                :key="card.id"
                class="h-1.5 rounded-full bg-border-strong transition-all duration-300"
                :class="activeIndex === index ? 'w-10 bg-accent' : 'w-4'"
              />
            </div>
          </div>
        </div>

        <div class="pointer-events-none absolute inset-0 z-0 hidden items-center justify-center lg:flex">
          <h2
            class="font-display text-[clamp(5rem,13vw,12rem)] font-black uppercase leading-[0.94] tracking-[-0.045em] text-text transition-[opacity,transform] duration-300"
            :class="isFinal ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'"
          >
            ДЛЯ КОГО
          </h2>
        </div>

        <div
          ref="stageRef"
          class="absolute inset-x-0 top-0 z-10 hidden h-[150vw] w-full will-change-transform transition-opacity duration-200 lg:block"
          :class="isActiveFlow ? 'opacity-100' : 'opacity-0'"
          :style="stageStyle"
        >
          <article
            v-for="(card, index) in desktopCards"
            :key="card.id"
            class="group absolute flex h-[var(--audience-col-width)] w-[var(--audience-col-width)] flex-col justify-between overflow-hidden border p-4 backdrop-blur-[6px] transition-colors duration-300"
            :class="slotTone(index)"
            :style="slotStyle(index)"
          >
            <span
              aria-hidden="true"
              class="pointer-events-none relative z-10 ml-auto block h-7 w-12 shrink-0 bg-current [-webkit-mask:url(/images/frame-1321316003.svg)_center/contain_no-repeat] [mask:url(/images/frame-1321316003.svg)_center/contain_no-repeat]"
            />

            <div class="absolute inset-4 flex flex-col justify-end transition-[opacity,transform] duration-300 group-hover:-translate-y-2.5 group-hover:opacity-0">
              <strong class="font-display text-[clamp(2rem,2.8vw,2.8rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
                {{ card.title }}
              </strong>
              <small
                v-if="card.description"
                class="mt-2 font-sans text-sm leading-5"
              >
                {{ card.description }}
              </small>
            </div>

            <div class="absolute inset-4 flex translate-y-2.5 flex-col justify-end opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <strong class="font-display text-base uppercase leading-4">
                {{ card.hoverTitle ?? card.title }}
              </strong>
              <small
                v-if="card.hoverDescription || card.description"
                class="mt-2 font-sans text-sm leading-5"
              >
                {{ card.hoverDescription ?? card.description }}
              </small>
            </div>
          </article>
        </div>

        <div
          class="absolute inset-0 z-20 hidden flex-col items-center justify-center gap-8 transition-[opacity,transform] duration-300 lg:flex"
          :class="isFinal ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'"
        >
          <h2 class="font-display text-[clamp(5rem,13vw,12rem)] font-black uppercase leading-[0.94] tracking-[-0.045em] text-text">
            Это про меня
          </h2>
          <NuxtLink
            :to="ROUTES.SHOOTING_REQUEST"
            class="inline-flex min-h-11 items-center justify-center border border-accent bg-accent px-4 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-text-on-accent transition-colors hover:border-text hover:bg-text"
          >
            Стать участником
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
