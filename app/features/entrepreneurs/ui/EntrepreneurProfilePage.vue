<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'
import BlogArticleCard from '@features/blog/ui/BlogArticleCard.vue'
import InterviewCard from '@features/interviews/ui/InterviewCard.vue'
import ReelModal from '@features/reels/ui/ReelModal.vue'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
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

watch(activeReel, (value) => {
  if (import.meta.client) {
    document.body.style.overflow = value ? 'hidden' : ''
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="flex flex-col">
    <template
      v-for="sectionKey in orderedSections"
      :key="sectionKey"
    >
      <section
        v-if="sectionKey === 'hero'"
        class="bg-text px-4 py-12 text-text-on-accent sm:px-6 lg:px-10 lg:py-18"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
          <NuxtLink
            :to="ROUTES.ENTREPRENEURS"
            class="font-sans text-sm uppercase leading-4 text-text-on-accent/72 transition-colors hover:text-text-on-accent sm:text-base"
          >
            ← Все предприниматели
          </NuxtLink>

          <div class="grid gap-8">
            <div class="flex flex-wrap items-start justify-between gap-6">
              <div class="max-w-[78rem]">
                <p class="font-display text-sm uppercase leading-4 tracking-[0.24em] text-text-on-accent/62 sm:text-base">
                  WHO'S THE
                </p>
                <div class="mt-5 grid gap-1">
                  <p
                    v-if="entrepreneur.heroRightTeaser"
                    class="max-w-[28rem] justify-self-end font-sans text-base leading-7 text-text-on-accent/76 sm:text-lg"
                  >
                    {{ entrepreneur.heroRightTeaser }}
                  </p>
                  <div class="grid gap-2 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-end">
                    <p
                      v-if="entrepreneur.heroLeftTeaser"
                      class="font-sans text-base leading-7 text-text-on-accent/76 sm:text-lg"
                    >
                      {{ entrepreneur.heroLeftTeaser }}
                    </p>
                    <h1 class="font-display text-[clamp(4rem,14vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
                      {{ entrepreneur.heroLastName }}
                    </h1>
                  </div>
                  <div class="grid gap-2 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
                    <h1 class="font-display text-[clamp(4rem,14vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
                      {{ entrepreneur.heroFirstName }}
                    </h1>
                    <p
                      v-if="entrepreneur.heroBottomRightTeaser"
                      class="justify-self-end font-sans text-base leading-7 text-text-on-accent/76 sm:text-lg"
                    >
                      {{ entrepreneur.heroBottomRightTeaser }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="overflow-hidden border-t border-white/15 pt-6">
              <div class="flex min-w-max gap-5 font-sans text-sm uppercase leading-4 text-text-on-accent/60 sm:text-base">
                <span
                  v-for="index in 6"
                  :key="index"
                >
                  {{ entrepreneur.heroMarquee }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'about'"
        class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[440px_minmax(0,1fr)]">
          <div class="space-y-5">
            <p
              v-if="entrepreneur.aboutIntroDescription"
              class="font-sans text-lg leading-8 text-text/82"
            >
              {{ entrepreneur.aboutIntroDescription }}
            </p>

            <div class="grid gap-4">
              <a
                v-for="item in entrepreneur.aboutMenuItems"
                :key="item.href"
                :href="item.href"
                class="group border border-border-strong bg-surface p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="space-y-3">
                    <h2 class="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text">
                      {{ item.label }}
                    </h2>
                    <p class="font-sans text-base leading-7 text-text/72">
                      {{ item.note }}
                    </p>
                  </div>
                  <span class="font-sans text-sm uppercase leading-4 text-accent">[ ↗ ]</span>
                </div>
              </a>
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <figure
              v-for="(image, index) in entrepreneur.aboutGalleryImages"
              :key="`${image}-${index}`"
              class="overflow-hidden border border-border-strong bg-surface"
            >
              <img
                :src="image"
                :alt="entrepreneur.name"
                class="h-full w-full object-cover"
              >
            </figure>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'biography'"
        id="biography"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div class="space-y-5">
            <h2 class="font-display text-[clamp(2.8rem,7vw,5.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
              Биография
            </h2>
            <a
              href="#interviews"
              class="inline-flex items-center gap-3 border border-border-strong px-4 py-3 font-sans text-sm uppercase leading-4 text-accent transition-colors hover:border-accent sm:text-base"
            >
              <span>Смотреть интервью</span>
              <span aria-hidden="true">[ ↗ ]</span>
            </a>
            <div
              v-if="entrepreneur.biographyPhoto"
              class="overflow-hidden border border-border-strong bg-bg"
            >
              <img
                :src="entrepreneur.biographyPhoto"
                :alt="entrepreneur.name"
                class="h-full w-full object-cover"
              >
            </div>
          </div>

          <div class="grid gap-5 xl:grid-cols-2">
            <article
              v-for="(block, index) in entrepreneur.biographyBlocks"
              :key="`${index}-${block.slice(0, 24)}`"
              class="border border-border-strong bg-bg p-5 font-sans text-base leading-7 text-text/82 sm:p-6 sm:text-lg"
            >
              {{ block }}
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'childhood'"
        id="childhood"
        class="bg-accent px-4 py-12 text-text-on-accent sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[0.84fr_1fr_1fr]">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
            {{ entrepreneur.childhoodTitle }}
          </h2>
          <p class="font-sans text-base leading-8 text-text-on-accent/86 sm:text-lg">
            {{ entrepreneur.childhoodTextOne }}
          </p>
          <p
            v-if="entrepreneur.childhoodTextTwo"
            class="font-sans text-base leading-8 text-text-on-accent/86 sm:text-lg"
          >
            {{ entrepreneur.childhoodTextTwo }}
          </p>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'education'"
        id="education"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div class="space-y-6">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              <span
                v-for="(line, index) in educationTitleLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>
            <p class="max-w-[50rem] font-sans text-lg leading-8 text-text/82 whitespace-pre-line">
              {{ entrepreneur.educationText }}
            </p>
            <p
              v-if="entrepreneur.educationAsideText"
              class="max-w-[34rem] border-l-4 border-accent pl-5 font-sans text-base leading-7 text-text/72 whitespace-pre-line"
            >
              {{ entrepreneur.educationAsideText }}
            </p>
          </div>

          <div
            v-if="entrepreneur.educationPhoto"
            class="overflow-hidden border border-border-strong bg-surface"
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
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            Рилсы
          </h2>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <button
              v-for="reel in entrepreneur.reels"
              :key="reel.slug"
              type="button"
              class="group overflow-hidden border border-border-strong bg-bg text-left transition-transform duration-300 hover:-translate-y-1"
              @click="activeReelSlug = reel.slug"
            >
              <div class="relative aspect-[9/16] overflow-hidden">
                <img
                  :src="reel.coverImage || reel.entrepreneur?.photo || '/images/placeholder.svg'"
                  :alt="reel.title"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                >
                <div class="absolute inset-0 bg-linear-to-t from-text/72 via-transparent to-transparent" />
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 font-sans text-sm uppercase leading-4 text-text-on-accent backdrop-blur">
                    Play
                  </span>
                </div>
              </div>

              <div class="space-y-2 p-5">
                <h3 class="font-display text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text">
                  {{ reel.title }}
                </h3>
                <p
                  v-if="reel.description"
                  class="font-sans text-base leading-7 text-text/72"
                >
                  {{ reel.description }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'turnover'"
        id="turnover"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
          <div class="space-y-5">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              <span
                v-for="(line, index) in turnoverTitleLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>
            <div
              v-if="entrepreneur.turnoverPhoto"
              class="overflow-hidden border border-border-strong bg-surface"
            >
              <img
                :src="entrepreneur.turnoverPhoto"
                :alt="entrepreneur.name"
                class="h-full w-full object-cover"
              >
            </div>
          </div>

          <div class="grid gap-5">
            <article class="border border-border-strong bg-surface p-5 font-sans text-base leading-7 text-text/82 sm:p-6 sm:text-lg">
              {{ entrepreneur.turnoverText }}
            </article>
            <article
              v-if="entrepreneur.turnoverBottomText"
              class="border border-border-strong bg-accent p-5 font-sans text-base leading-7 text-text-on-accent sm:p-6 sm:text-lg"
            >
              {{ entrepreneur.turnoverBottomText }}
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'more'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div class="grid gap-5 sm:grid-cols-2">
            <component
              :is="item.href ? 'a' : 'div'"
              v-for="(item, index) in entrepreneur.moreItems"
              :key="`${item.title}-${index}`"
              :href="item.href || undefined"
              class="group flex min-h-[190px] flex-col justify-between border border-border-strong bg-bg p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
            >
              <div class="inline-flex items-center gap-3 font-sans text-sm uppercase leading-4 text-accent">
                <span>{{ item.href ? 'Открыть' : 'Скоро' }}</span>
                <span aria-hidden="true">[ ↗ ]</span>
              </div>
              <h3 class="font-display text-[clamp(2rem,5vw,3.2rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text whitespace-pre-line">
                {{ item.title }}
              </h3>
            </component>
          </div>

          <div
            v-if="entrepreneur.morePhoto"
            class="overflow-hidden border border-border-strong bg-bg"
          >
            <img
              :src="entrepreneur.morePhoto"
              :alt="entrepreneur.name"
              class="h-full w-full object-cover"
            >
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'featuredInterview'"
        id="interviews"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1240px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            Смотреть интервью
          </h2>

          <VideoFrame
            :title="`Интервью ${entrepreneur.name}`"
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
        description="Если вы хотите присоединиться к проекту и рассказать о своем пути, оставьте заявку, и мы свяжемся с вами."
        headline="Есть история&#10;для выпуска?"
      />

      <PageBannerSection
        v-else-if="sectionKey === 'banner'"
        :desktop-image="entrepreneur.bannerImage"
        :mobile-image="entrepreneur.bannerMobileImage"
        :href="entrepreneur.bannerLink"
        fallback-text="Следующий&#10;герой уже&#10;в проекте"
      />

      <section
        v-else-if="sectionKey === 'interviewList'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            Интервью
          </h2>

          <div class="grid gap-5 xl:grid-cols-3">
            <InterviewCard
              v-for="item in entrepreneur.interviews"
              :key="item.id"
              :interview="item"
            />
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'articles'"
        id="articles"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            Статьи
          </h2>

          <div class="grid gap-5">
            <BlogArticleCard
              v-for="item in entrepreneur.articles"
              :key="item.id"
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
