<script setup lang="ts">
import type { EntrepreneurDetailData } from '@features/entrepreneurs/model/entrepreneur.types'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import { ROUTES } from '@shared/navigation'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import EntrepreneurAboutSection from './profile/EntrepreneurAboutSection.vue'
import EntrepreneurFeaturedInterviewSection from './profile/EntrepreneurFeaturedInterviewSection.vue'
import EntrepreneurInterviewListSection from './profile/EntrepreneurInterviewListSection.vue'
import EntrepreneurMoreSection from './profile/EntrepreneurMoreSection.vue'
import EntrepreneurProfileHero from './profile/EntrepreneurProfileHero.vue'
import EntrepreneurRelatedSection from './profile/EntrepreneurRelatedSection.vue'
import EntrepreneurShortsSection from './profile/EntrepreneurShortsSection.vue'
import EntrepreneurStoryVariant01 from './profile/EntrepreneurStoryVariant01.vue'
import EntrepreneurStoryVariant02 from './profile/EntrepreneurStoryVariant02.vue'
import EntrepreneurStoryVariant03 from './profile/EntrepreneurStoryVariant03.vue'

const props = defineProps<{
  entrepreneur: EntrepreneurDetailData
  success: boolean
  error: boolean
}>()

const sectionOrder = computed(() => new Map(props.entrepreneur.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => props.entrepreneur.sectionVisibility[key] !== false
const biographyBlocks = computed(() => props.entrepreneur.biographyBlocks.filter(Boolean))
</script>

<template>
  <article class="flex flex-col overflow-hidden bg-bg">
    <EntrepreneurProfileHero
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      :entrepreneur="entrepreneur"
    />

    <EntrepreneurAboutSection
      v-if="isVisible('about')"
      :style="sectionStyle('about')"
      :intro="entrepreneur.aboutIntroDescription || entrepreneur.quote || ''"
      :name="entrepreneur.name"
      :items="entrepreneur.aboutMenuItems"
      :gallery="entrepreneur.aboutGalleryImages"
    />

    <EntrepreneurStoryVariant01
      v-if="isVisible('biography')"
      id="biography"
      :style="sectionStyle('biography')"
      eyebrow="Биография"
      :title="entrepreneur.biographyTitle || entrepreneur.name"
      :image="entrepreneur.biographyPhoto"
      :image-alt="entrepreneur.name"
      :blocks="biographyBlocks"
    />

    <EntrepreneurStoryVariant02
      v-if="isVisible('childhood')"
      id="childhood"
      :style="sectionStyle('childhood')"
      :title="entrepreneur.childhoodTitle"
      :text-one="entrepreneur.childhoodTextOne"
      :text-two="entrepreneur.childhoodTextTwo"
    />

    <EntrepreneurStoryVariant03
      v-if="isVisible('education')"
      id="education"
      :style="sectionStyle('education')"
      :title="entrepreneur.educationTitle"
      :text="entrepreneur.educationText"
      :aside-text="entrepreneur.educationAsideText"
      :image="entrepreneur.educationPhoto"
      :image-alt="entrepreneur.name"
    />

    <EntrepreneurShortsSection
      v-if="isVisible('shorts')"
      :style="sectionStyle('shorts')"
      :reels="entrepreneur.reels"
    />

    <EntrepreneurStoryVariant03
      v-if="isVisible('turnover')"
      id="turnover"
      :style="sectionStyle('turnover')"
      :title="entrepreneur.turnoverTitle"
      :text="entrepreneur.turnoverText"
      :bottom-text="entrepreneur.turnoverBottomText"
      :image="entrepreneur.turnoverPhoto"
      :image-alt="entrepreneur.name"
      image-aspect="wide"
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
      v-if="isVisible('banner')"
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
