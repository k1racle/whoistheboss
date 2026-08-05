<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'
import BlogArticleCard from '@features/blog/ui/BlogArticleCard.vue'
import InterviewCard from '@features/interviews/ui/InterviewCard.vue'
import ReelModal from '@features/reels/ui/ReelModal.vue'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'

const props = defineProps<{
  entrepreneur: EntrepreneurDetailData
  success?: boolean
  error?: boolean
}>()

const activeReelSlug = ref<string | null>(null)

const activeReel = computed(() =>
  props.entrepreneur.reels.find((item) => item.slug === activeReelSlug.value) ?? null
)

const shortsItems = computed(() => props.entrepreneur.reels.slice(0, 3))

const shortsGridItems = computed(() => ([
  ...shortsItems.value,
  ...Array.from({ length: Math.max(0, 3 - shortsItems.value.length) }, () => null),
]))

const orderedSections = computed(() =>
  props.entrepreneur.sectionOrder.filter((key) => {
    if (!isSectionVisible(props.entrepreneur.sectionVisibility, key)) return false

    if (key === 'shorts') return props.entrepreneur.reels.length > 0
    if (key === 'featuredInterview') {
      return Boolean(props.entrepreneur.featuredInterviewVideoUrl || props.entrepreneur.featuredInterviewVideoFile)
    }
    if (key === 'interviewList') return props.entrepreneur.interviews.length > 0
    if (key === 'articles') return props.entrepreneur.articles.length > 0

    return true
  })
)

const educationTitleLines = computed(() =>
  props.entrepreneur.educationTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
)

const turnoverTitleLines = computed(() =>
  props.entrepreneur.turnoverTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
)

const morePrimaryItems = computed(() => props.entrepreneur.moreItems.slice(0, 3))
const moreSecondaryItem = computed(() => props.entrepreneur.moreItems[3] ?? null)

const ABOUT_MENU_ORDER = ['#biography', '#childhood', '#education', '#turnover', '#articles', '#contacts'] as const

const defaultAboutCardIndex = computed(() => (props.entrepreneur.aboutMenuItems.length > 1 ? 1 : 0))
const activeAboutCardIndex = ref(0)

const activeAboutMenuItem = computed(() =>
  props.entrepreneur.aboutMenuItems[activeAboutCardIndex.value]
  ?? props.entrepreneur.aboutMenuItems[0]
  ?? null,
)

const activeAboutPhotoIndex = computed(() => {
  const galleryLength = props.entrepreneur.aboutGalleryImages.length

  if (!galleryLength || !activeAboutMenuItem.value) {
    return 0
  }

  const orderIndex = ABOUT_MENU_ORDER.indexOf(
    activeAboutMenuItem.value.href as (typeof ABOUT_MENU_ORDER)[number],
  )

  const baseIndex = orderIndex >= 0 ? orderIndex : activeAboutCardIndex.value

  return baseIndex % galleryLength
})

watch(
  () => props.entrepreneur.aboutMenuItems.length,
  () => {
    activeAboutCardIndex.value = defaultAboutCardIndex.value
  },
  { immediate: true },
)

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

watch(activeReel, (value) => {
  if (import.meta.client) {
    document.body.style.overflow = value ? 'hidden' : ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateLogoVisibility)
  window.removeEventListener('resize', updateLogoVisibility)
  logoVisible.value = true

  if (import.meta.client) {
    document.body.style.overflow = ''
  }
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
        class="overflow-hidden bg-text px-4 pb-10 pt-10 text-text-on-accent sm:px-6 sm:pb-12 sm:pt-14 lg:px-10 lg:pb-14 lg:pt-18"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
            <div class="space-y-6">
              <p class="font-sans text-sm uppercase leading-4 text-white/50 sm:text-base">
                WHO'S THE
              </p>

              <div class="space-y-2">
                <p
                  v-if="entrepreneur.heroRightTeaser"
                  class="max-w-[34rem] font-sans text-base leading-7 text-white/74 sm:text-lg"
                >
                  {{ entrepreneur.heroRightTeaser }}
                </p>

                <div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                  <p
                    v-if="entrepreneur.heroLeftTeaser"
                    class="max-w-[16rem] font-sans text-sm uppercase leading-6 text-white/58 sm:text-base"
                  >
                    {{ entrepreneur.heroLeftTeaser }}
                  </p>

                  <h1 class="font-display text-[clamp(4.8rem,15vw,11rem)] font-black uppercase leading-[0.8] tracking-[-0.055em] text-accent lg:text-right">
                    {{ entrepreneur.heroLastName }}
                  </h1>
                </div>

                <div class="grid gap-3 lg:grid-cols-[auto_minmax(220px,320px)] lg:items-end">
                  <h1 class="font-display text-[clamp(4.8rem,15vw,11rem)] font-black uppercase leading-[0.8] tracking-[-0.055em] text-white">
                    {{ entrepreneur.heroFirstName }}
                  </h1>

                  <p
                    v-if="entrepreneur.heroBottomRightTeaser"
                    class="max-w-[18rem] font-sans text-sm uppercase leading-6 text-white/58 sm:text-base lg:justify-self-end"
                  >
                    {{ entrepreneur.heroBottomRightTeaser }}
                  </p>
                </div>
              </div>
            </div>

            <div class="border-l border-white/12 pl-0 lg:pl-6">
              <p class="font-sans text-base leading-7 text-white/72 sm:text-lg">
                {{ entrepreneur.title }}
              </p>
            </div>
          </div>

          <div class="overflow-hidden border-t border-white/12 pt-5">
            <div class="hero-marquee-track flex min-w-max gap-5 whitespace-nowrap">
              <template
                v-for="index in 8"
                :key="index"
              >
                <span class="font-display text-3xl font-black uppercase leading-none tracking-[-0.04em] text-white/82 sm:text-4xl">
                  {{ entrepreneur.heroMarquee }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'about'"
        id="about"
        class="bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <p
            v-if="entrepreneur.aboutIntroDescription"
            class="max-w-[48rem] font-sans text-base leading-7 text-text/74 sm:text-lg"
          >
            {{ entrepreneur.aboutIntroDescription }}
          </p>

          <div class="grid gap-6 xl:grid-cols-[minmax(320px,520px)_minmax(0,1fr)] xl:items-start">
            <div class="grid gap-3">
              <a
                v-for="(item, index) in entrepreneur.aboutMenuItems"
                :key="`${item.href}-${index}`"
                :href="item.href"
                class="group grid gap-3 border border-border-strong bg-bg p-5 transition-colors duration-200 hover:border-accent"
                :class="index === activeAboutCardIndex ? 'border-accent bg-[#f7f7f4]' : ''"
                @mouseenter="activeAboutCardIndex = index"
                @focus="activeAboutCardIndex = index"
              >
                <strong class="font-display text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-text transition-colors group-hover:text-accent">
                  {{ item.label }}
                </strong>
                <span class="font-sans text-sm leading-6 text-text/62 sm:text-base">
                  {{ item.note }}
                </span>
              </a>
            </div>

            <div class="overflow-hidden border border-border-strong bg-bg">
              <img
                :src="entrepreneur.aboutGalleryImages[activeAboutPhotoIndex] || '/images/placeholder.svg'"
                :alt="entrepreneur.name"
                class="h-full min-h-[420px] w-full object-cover"
              >
            </div>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'biography'"
        id="biography"
        class="bg-[#f7f7f4] px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div class="space-y-5">
            <p class="font-sans text-sm uppercase leading-4 text-text/48 sm:text-base">
              Биография
            </p>
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] text-text">
              <span class="block text-accent">WHO'S THE</span>
              <span class="block">{{ entrepreneur.biographyTitle }}?</span>
            </h2>

            <a
              href="#interviews"
              class="inline-flex min-h-11 items-center justify-center border border-border-strong bg-surface px-4 py-2.5 font-sans text-sm uppercase leading-4 text-text transition-colors hover:border-accent hover:text-accent sm:text-base"
            >
              Смотреть интервью
            </a>

            <div
              v-if="entrepreneur.biographyPhoto"
              class="overflow-hidden border border-border-strong bg-surface"
            >
              <img
                :src="entrepreneur.biographyPhoto"
                :alt="entrepreneur.name"
                class="h-full w-full object-cover"
              >
            </div>
          </div>

          <div class="grid gap-5 lg:grid-cols-2">
            <article
              v-for="(block, index) in entrepreneur.biographyBlocks"
              :key="`${index}-${block.slice(0, 24)}`"
              class="border border-border-strong bg-surface p-5 font-sans text-base leading-7 text-text/82 sm:p-6 sm:text-lg"
            >
              {{ block }}
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'childhood'"
        id="childhood"
        class="bg-accent px-4 py-14 text-text-on-accent sm:px-6 lg:px-10 lg:py-18"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)]">
          <h2 class="font-display text-[clamp(3.4rem,9vw,6.5rem)] font-black uppercase leading-[0.86] tracking-[-0.045em]">
            {{ entrepreneur.childhoodTitle }}
          </h2>

          <div class="grid gap-5 font-sans text-base leading-7 text-white/90 sm:text-lg">
            <p>{{ entrepreneur.childhoodTextOne }}</p>
            <p v-if="entrepreneur.childhoodTextTwo">{{ entrepreneur.childhoodTextTwo }}</p>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'education'"
        id="education"
        class="bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div class="space-y-6">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] text-text">
              <span
                v-for="(line, index) in educationTitleLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>

            <p class="max-w-[48rem] font-sans text-base leading-7 text-text/82 sm:text-lg">
              {{ entrepreneur.educationText }}
            </p>

            <div class="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end">
              <a
                href="#interviews"
                class="inline-flex min-h-11 items-center justify-center border border-border-strong bg-bg px-4 py-2.5 font-sans text-sm uppercase leading-4 text-text transition-colors hover:border-accent hover:text-accent sm:text-base"
              >
                Смотреть интервью
              </a>

              <p
                v-if="entrepreneur.educationAsideText"
                class="max-w-[26rem] font-sans text-sm leading-6 text-text/58 sm:text-base"
              >
                {{ entrepreneur.educationAsideText }}
              </p>
            </div>
          </div>

          <div
            v-if="entrepreneur.educationPhoto"
            class="overflow-hidden border border-border-strong bg-bg"
          >
            <img
              :src="entrepreneur.educationPhoto"
              :alt="entrepreneur.name"
              class="h-full w-full object-cover"
            >
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'shorts'"
        class="bg-[#f7f7f4] px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <div class="flex items-end justify-between gap-4">
            <h2 class="font-display text-[clamp(3rem,8vw,5.5rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-text">
              Shorts
            </h2>
            <NuxtLink
              :to="ROUTES.REELS"
              class="font-sans text-sm uppercase leading-4 text-accent transition-colors hover:text-text sm:text-base"
            >
              Все reels
            </NuxtLink>
          </div>

          <div class="grid gap-5 md:grid-cols-3">
            <button
              v-for="(item, index) in shortsGridItems"
              :key="item?.slug || `placeholder-${index}`"
              type="button"
              class="group relative overflow-hidden border border-border-strong bg-text text-left"
              :class="item ? 'cursor-pointer' : 'cursor-default opacity-45'"
              :disabled="!item"
              @click="activeReelSlug = item?.slug ?? null"
            >
              <img
                v-if="item?.coverImage"
                :src="item.coverImage"
                :alt="item.title"
                class="h-[440px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              >
              <div
                v-else
                class="flex h-[440px] items-center justify-center bg-[#111] font-sans text-sm uppercase leading-4 text-white/54 sm:text-base"
              >
                Видео
              </div>

              <div class="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/80" />

              <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <p class="font-display text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white">
                    {{ item?.title || 'Скоро' }}
                  </p>
                  <p
                    v-if="item?.entrepreneur?.name"
                    class="mt-2 font-sans text-sm uppercase leading-4 text-white/64 sm:text-base"
                  >
                    {{ item.entrepreneur.name }}
                  </p>
                </div>

                <span class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <svg
                    class="ml-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'turnover'"
        id="turnover"
        class="bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
          <div class="space-y-5">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] text-text">
              <span
                v-for="(line, index) in turnoverTitleLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>

            <a
              href="#interviews"
              class="inline-flex min-h-11 items-center justify-center border border-border-strong bg-bg px-4 py-2.5 font-sans text-sm uppercase leading-4 text-text transition-colors hover:border-accent hover:text-accent sm:text-base"
            >
              Смотреть интервью
            </a>

            <div
              v-if="entrepreneur.turnoverPhoto"
              class="overflow-hidden border border-border-strong bg-bg"
            >
              <img
                :src="entrepreneur.turnoverPhoto"
                :alt="entrepreneur.name"
                class="h-full w-full object-cover"
              >
            </div>
          </div>

          <div class="grid gap-5">
            <article class="border border-border-strong bg-bg p-5 font-sans text-base leading-7 text-text/82 sm:p-6 sm:text-lg">
              {{ entrepreneur.turnoverText }}
            </article>
            <article
              v-if="entrepreneur.turnoverBottomText"
              class="border border-border-strong bg-[#f7f7f4] p-5 font-sans text-base leading-7 text-text/72 sm:p-6 sm:text-lg"
            >
              {{ entrepreneur.turnoverBottomText }}
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'more'"
        class="bg-text px-4 py-12 text-text-on-accent sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div class="grid gap-5">
            <div class="grid gap-5 md:grid-cols-3">
              <component
                :is="item.href ? 'NuxtLink' : 'div'"
                v-for="(item, index) in morePrimaryItems"
                :key="`${item.title}-${index}`"
                :to="item.href || undefined"
                class="group flex min-h-[200px] flex-col justify-between border border-white/16 bg-white/6 p-5 transition-colors duration-300 hover:bg-white/10 sm:p-6"
              >
                <span class="font-sans text-sm uppercase leading-4 text-white/64 sm:text-base">
                  {{ item.href ? 'Открыть' : 'Скоро' }}
                </span>
                <strong class="font-display text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white">
                  {{ item.title }}
                </strong>
              </component>
            </div>

            <div class="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(240px,360px)]">
              <component
                :is="moreSecondaryItem?.href ? 'NuxtLink' : 'div'"
                :to="moreSecondaryItem?.href || undefined"
                class="group flex min-h-[220px] flex-col justify-between border border-white/16 bg-accent p-5 transition-colors duration-300 hover:bg-[#c82600] sm:p-6"
              >
                <span class="font-sans text-sm uppercase leading-4 text-white/74 sm:text-base">
                  {{ moreSecondaryItem?.href ? 'Открыть' : 'Скоро' }}
                </span>
                <strong class="font-display text-[clamp(2.4rem,6vw,3.6rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white whitespace-pre-line">
                  {{ moreSecondaryItem?.title || '' }}
                </strong>
              </component>

              <div
                v-if="entrepreneur.morePhoto"
                class="overflow-hidden border border-white/16 bg-white/6"
              >
                <img
                  :src="entrepreneur.morePhoto"
                  :alt="entrepreneur.name"
                  class="h-full w-full object-cover"
                >
              </div>
            </div>
          </div>

          <div class="hidden items-end justify-end xl:flex">
            <span class="font-display text-[clamp(5rem,10vw,8rem)] font-black uppercase leading-none tracking-[-0.06em] text-white/16">
              Больше
            </span>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'featuredInterview'"
        id="interviews"
        class="bg-[#f7f7f4] px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <h2 class="font-display text-[clamp(3rem,8vw,5.8rem)] font-black uppercase leading-[0.86] tracking-[-0.045em] text-text">
            Смотреть
            <br>
            интервью
          </h2>

          <VideoFrame
            :title="entrepreneur.name"
            :video-type="entrepreneur.featuredInterviewVideoType"
            :video-url="entrepreneur.featuredInterviewVideoUrl"
            :video-file="entrepreneur.featuredInterviewVideoFile"
            aspect-class="aspect-video"
          />
        </div>
      </section>

      <ShootingLeadSection
        v-else-if="sectionKey === 'cta'"
        :success="success"
        :error="error"
        :redirect-path="`${ROUTES.ENTREPRENEUR(entrepreneur.slug)}?success=1`"
        title="Стать героем"
        description="Оставьте заявку, если хотите рассказать свою историю и обсудить участие в проекте."
        headline="Готовы
к обсуждению
проекта?"
      />

      <PageBannerSection
        v-else-if="sectionKey === 'banner'"
        :desktop-image="entrepreneur.bannerImage"
        :mobile-image="entrepreneur.bannerMobileImage"
        :href="entrepreneur.bannerLink || ROUTES.ENTREPRENEURS"
        fallback-text="Следующий
материал уже
в проекте"
      />

      <section
        v-else-if="sectionKey === 'interviewList'"
        id="interview-list"
        class="bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <div class="flex items-end justify-between gap-4">
            <h2 class="font-display text-[clamp(3rem,8vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-text">
              Интервью
            </h2>
            <NuxtLink
              :to="ROUTES.INTERVIEWS"
              class="font-sans text-sm uppercase leading-4 text-accent transition-colors hover:text-text sm:text-base"
            >
              Все интервью
            </NuxtLink>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <InterviewCard
              v-for="item in entrepreneur.interviews"
              :key="item.slug"
              :interview="item"
            />
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'articles'"
        id="articles"
        class="bg-[#f7f7f4] px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <div class="flex items-end justify-between gap-4">
            <h2 class="font-display text-[clamp(3rem,8vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] text-text">
              Статьи
            </h2>
            <NuxtLink
              :to="ROUTES.BLOG"
              class="font-sans text-sm uppercase leading-4 text-accent transition-colors hover:text-text sm:text-base"
            >
              Все статьи
            </NuxtLink>
          </div>

          <div class="grid gap-6">
            <BlogArticleCard
              v-for="item in entrepreneur.articles"
              :key="item.slug"
              :article="item"
            />
          </div>
        </div>
      </section>
    </template>

    <ReelModal
      :reel="activeReel"
      @close="activeReelSlug = null"
    />
  </div>
</template>

<style scoped>
@keyframes hero-marquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.hero-marquee-track {
  animation: hero-marquee 24s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-marquee-track {
    animation: none;
  }
}
</style>
