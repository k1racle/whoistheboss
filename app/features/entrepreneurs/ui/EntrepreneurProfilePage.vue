<script setup lang="ts">
import {
  getEntrepreneurStorySectionAnchor,
  type EntrepreneurDetailData,
} from '@features/entrepreneurs/model/entrepreneur.types'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import { ROUTES } from '@shared/navigation'
import AdditionalSection from '@shared/ui/additional-sections/AdditionalSection.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import TextMarquee from '@shared/ui/marquee/TextMarquee.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'
import EntrepreneurAboutSection from './profile/EntrepreneurAboutSection.vue'
import EntrepreneurFeaturedInterviewSection from './profile/EntrepreneurFeaturedInterviewSection.vue'
import EntrepreneurInterviewListSection from './profile/EntrepreneurInterviewListSection.vue'
import EntrepreneurMoreSection from './profile/EntrepreneurMoreSection.vue'
import EntrepreneurProfileHero from './profile/EntrepreneurProfileHero.vue'
import EntrepreneurRelatedSection from './profile/EntrepreneurRelatedSection.vue'
import EntrepreneurShortsSection from './profile/EntrepreneurShortsSection.vue'

const props = defineProps<{
  entrepreneur: EntrepreneurDetailData
  success: boolean
  error: boolean
}>()

const sectionOrder = computed(() => new Map(props.entrepreneur.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => props.entrepreneur.sectionVisibility[key] !== false
const visibleStorySections = computed(() => props.entrepreneur.storySections.filter(section => section.isVisible))
const heroMarqueeText = computed(() =>
  props.entrepreneur.heroMarquee
  || [props.entrepreneur.name, props.entrepreneur.title, 'КТО ЗДЕСЬ ГЛАВНЫЙ'].filter(Boolean).join(' • '),
)
const { isEnabled: isBannerEnabled } = useSiteBanner()
</script>

<template>
  <article class="flex flex-col overflow-x-clip bg-bg">
    <EntrepreneurProfileHero
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      :entrepreneur="entrepreneur"
    />

    <TextMarquee
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      :text="heroMarqueeText"
      :duration-seconds="48"
    />

    <EntrepreneurAboutSection
      v-if="isVisible('about')"
      :style="sectionStyle('about')"
      :intro="entrepreneur.aboutIntroDescription || entrepreneur.quote || ''"
      :name="entrepreneur.name"
      :items="entrepreneur.aboutMenuItems"
      :gallery="entrepreneur.aboutGalleryImages"
    />

    <AdditionalSection
      v-for="storySection in visibleStorySections"
      :id="getEntrepreneurStorySectionAnchor(storySection.id)"
      :key="storySection.id"
      :style="sectionStyle(`story:${storySection.id}`)"
      :section="storySection"
      :subject-name="entrepreneur.name"
    />

    <EntrepreneurShortsSection
      v-if="isVisible('shorts')"
      :style="sectionStyle('shorts')"
      :reels="entrepreneur.reels"
    />

    <EntrepreneurMoreSection
      v-if="isVisible('more')"
      :style="sectionStyle('more')"
      :items="entrepreneur.moreItems"
      :image="entrepreneur.morePhoto"
      :image-alt="entrepreneur.name"
    />

    <EntrepreneurFeaturedInterviewSection
      v-if="isVisible('featuredInterview')"
      :style="sectionStyle('featuredInterview')"
      :name="entrepreneur.name"
      :video-type="entrepreneur.featuredInterviewVideoType"
      :video-url="entrepreneur.featuredInterviewVideoUrl"
      :video-file="entrepreneur.featuredInterviewVideoFile"
    />

    <EntrepreneurRelatedSection
      v-if="isVisible('articles') && entrepreneur.articles.length"
      :style="sectionStyle('articles')"
      :articles="entrepreneur.articles"
    />

    <LandingContactSection
      v-if="isVisible('cta')"
      :style="sectionStyle('cta')"
      cta-title="Стать участником"
      form-title="Заполните ваши данные для связи"
      form-description="Расскажем о формате съёмки и ответим на вопросы."
    />

    <PageBannerSection
      v-if="isVisible('banner') && isBannerEnabled('/entrepreneurs/SLUG')"
      :style="sectionStyle('banner')"
      :desktop-image="entrepreneur.bannerImage"
      :mobile-image="entrepreneur.bannerMobileImage"
      :href="entrepreneur.bannerLink || ROUTES.ENTREPRENEURS"
    />

    <EntrepreneurInterviewListSection
      v-if="isVisible('interviewList') && entrepreneur.interviews.length"
      :style="sectionStyle('interviewList')"
      :interviews="entrepreneur.interviews"
    />

    <p v-if="success" class="fixed bottom-5 right-5 z-50 bg-text px-5 py-4 text-sm text-white" role="status">
      Заявка отправлена.
    </p>
    <p v-if="error" class="fixed bottom-5 right-5 z-50 bg-accent px-5 py-4 text-sm text-white" role="alert">
      Не удалось отправить заявку.
    </p>
  </article>
</template>
