<script setup lang="ts">
import type { EntrepreneursPageData } from '@features/entrepreneurs/model/entrepreneur.types'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'
import EntrepreneurPosterCard from '@shared/ui/cards/EntrepreneurPosterCard.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<{
  page: EntrepreneursPageData
  success?: boolean
  error?: boolean
}>()

const heroLines = computed(() =>
  props.page.heroTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
)

const heroPrimaryLine = computed(() => heroLines.value[0] || 'КТО ЗДЕСЬ')
const heroAccentLine = computed(() => heroLines.value.slice(1).join(' ') || 'ГЛАВНЫЙ?')

const orderedSections = computed(() =>
  props.page.sectionOrder.filter((key) => isSectionVisible(props.page.sectionVisibility, key)),
)

const audienceCards = computed(() => props.page.audienceCards.slice(0, 7))

const audienceCardLayouts = [
  'xl:translate-y-8',
  'xl:col-span-2',
  'xl:-translate-y-6',
  'xl:translate-y-12',
  'xl:col-span-2',
  'xl:-translate-y-10',
  'xl:translate-y-4',
] as const

const { logoVisible } = useSiteHeader()
const heroSectionRef = ref<HTMLElement | null>(null)
logoVisible.value = false

const updateLogoVisibility = () => {
  const heroBottom = heroSectionRef.value?.getBoundingClientRect().bottom ?? 0
  const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0

  logoVisible.value = heroBottom <= headerBottom + 12
}

onMounted(() => {
  updateLogoVisibility()
  window.addEventListener('scroll', updateLogoVisibility, { passive: true })
  window.addEventListener('resize', updateLogoVisibility)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateLogoVisibility)
  window.removeEventListener('resize', updateLogoVisibility)
  logoVisible.value = true
})
</script>

<template>
  <div class="flex flex-col bg-bg">
    <template
      v-for="sectionKey in orderedSections"
      :key="sectionKey"
    >
      <section
        v-if="sectionKey === 'hero'"
        ref="heroSectionRef"
        class="bg-text px-4 pb-14 pt-10 text-text-on-accent sm:px-6 sm:pb-20 sm:pt-14 lg:px-10 lg:pb-24 lg:pt-18"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8 sm:gap-10">
          <p class="font-sans text-sm uppercase leading-4 text-white/56 sm:text-base">
            Предприниматели
          </p>

          <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] lg:items-end">
            <div>
              <h1 class="font-display text-[clamp(4.5rem,17vw,13rem)] font-black uppercase leading-[0.8] tracking-[-0.055em]">
                <span class="block">{{ heroPrimaryLine }}</span>
                <span class="block text-accent">{{ heroAccentLine }}</span>
              </h1>
            </div>

            <p class="max-w-[30rem] font-sans text-base leading-7 text-white/78 sm:text-lg">
              {{ page.audienceText }}
            </p>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'audience'"
        class="bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-10 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)] xl:items-start">
          <div class="max-w-[38rem] space-y-5">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-text">
              {{ page.audienceTitle }}
            </h2>
            <p class="font-sans text-base leading-7 text-text/74 sm:text-lg">
              {{ page.audienceText }}
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="(card, index) in audienceCards"
              :key="card.id"
              class="group relative min-h-[190px] overflow-hidden border border-border-strong bg-bg p-5 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[210px] sm:p-6"
              :class="audienceCardLayouts[index] || ''"
            >
              <div class="flex h-full flex-col justify-between gap-6">
                <div class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold uppercase text-text-on-accent">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>

                <div class="space-y-3">
                  <h3 class="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-text transition-colors duration-300 group-hover:text-accent">
                    {{ card.hoverTitle || card.title }}
                  </h3>
                  <p
                    v-if="card.hoverDescription || card.description"
                    class="font-sans text-sm leading-6 text-text/64 sm:text-base"
                  >
                    {{ card.hoverDescription || card.description }}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'heroes'"
        class="bg-[#f7f7f4] px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
          <div class="grid gap-5 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-text">
              {{ page.heroesTitle }}
            </h2>
            <p class="max-w-[36rem] font-sans text-base leading-7 text-text/72 sm:text-lg">
              {{ page.heroesText }}
            </p>
          </div>

          <div
            v-if="page.entrepreneurs.length"
            class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <EntrepreneurPosterCard
              v-for="item in page.entrepreneurs"
              :key="item.slug"
              :entrepreneur="item"
            />
          </div>

          <p
            v-else
            class="border border-border-strong bg-surface px-6 py-10 font-sans text-base leading-7 text-text/56"
          >
            Предприниматели скоро появятся.
          </p>
        </div>
      </section>

      <ShootingLeadSection
        v-else-if="sectionKey === 'cta'"
        :success="success"
        :error="error"
        :redirect-path="`${ROUTES.ENTREPRENEURS}?success=1`"
        title="Стать героем"
        description="Оставьте заявку, если хотите рассказать о себе, своем деле и стать частью проекта."
        headline="Готовы
к обсуждению
проекта?"
      />

      <PageBannerSection
        v-else-if="sectionKey === 'banner'"
        :desktop-image="page.bannerImage"
        :mobile-image="page.bannerMobileImage"
        :href="page.bannerLink || ROUTES.ENTREPRENEURS"
        fallback-text="Здесь будет баннер
о новом выпуске"
      />
    </template>
  </div>
</template>
