<script setup lang="ts">
import type { ShootingPageData } from '@features/shooting-request/model/shooting-page.types'
import ShootingAboutSection from '@features/shooting-request/ui/ShootingAboutSection.vue'
import ShootingFaqSection from '@features/shooting-request/ui/ShootingFaqSection.vue'
import ShootingStagesSection from '@features/shooting-request/ui/ShootingStagesSection.vue'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'

const props = defineProps<{
  page: ShootingPageData
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  showBanner: boolean
}>()

const sectionOrder = computed(() => new Map(props.page.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => props.page.sectionVisibility[key] !== false

</script>

<template>
  <div class="flex flex-col overflow-x-clip bg-bg">
    <LandingHeroSection
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      title="Как принять участие"
    />

    <ShootingAboutSection
      v-if="isVisible('about')"
      :style="sectionStyle('about')"
      :title="page.aboutTitle"
      :text="page.aboutText"
      :bottom-text="page.aboutBottomText"
      :banner-image="bannerImage"
      :banner-mobile-image="bannerMobileImage"
      :banner-link="bannerLink"
      :show-banner="showBanner"
    />

    <ShootingStagesSection
      v-if="isVisible('stages')"
      :style="sectionStyle('stages')"
      :title="page.stagesTitle"
      :stages="page.stages"
    />

    <ShootingFaqSection
      v-if="isVisible('faq')"
      :style="sectionStyle('faq')"
      :title="page.faqTitle"
      :items="page.faqItems"
    />

    <LandingContactSection
      v-if="isVisible('cta')"
      :style="sectionStyle('cta')"
      cta-title="Стать участником"
      form-title="Заполните ваши данные для связи"
      form-description="Отправьте заявку, и мы свяжемся с вами."
    />
  </div>
</template>
