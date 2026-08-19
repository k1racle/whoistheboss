<script setup lang="ts">
import type { LandingPageData } from '@features/landing/model/landing.data'
import { toLandingHeroCard } from '@features/entrepreneurs/model/entrepreneur-card'
import LandingAboutSection from '@features/landing/ui/sections/LandingAboutSection.vue'
import LandingArticles from '@features/landing/ui/sections/LandingArticles.vue'
import LandingAudienceSection from '@features/landing/ui/sections/LandingAudienceSection.vue'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import LandingFeaturedHeroSection from '@features/landing/ui/sections/LandingFeaturedHeroSection.vue'
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import LandingOurHeroesSection from '@features/landing/ui/sections/LandingOurHeroesSection.vue'
import LandingPlacesSection from '@features/landing/ui/sections/LandingPlacesSection.vue'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const props = defineProps<{
  page: LandingPageData
}>()

const heroes = computed(() => props.page.entrepreneurs.map(toLandingHeroCard))

const { logoVisible } = useSiteHeader()
const { isEnabled: isBannerEnabled } = useSiteBanner()

const aboutSectionRef = ref<InstanceType<typeof LandingAboutSection> | null>(null)

const updateLogoVisibility = () => {
  const logoEl = aboutSectionRef.value?.logoRef
  if (!logoEl) return

  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
  const logoTop = logoEl.getBoundingClientRect().top

  logoVisible.value = logoTop < headerHeight
}

let logoFrameId: number | undefined
const scheduleLogoVisibilityUpdate = () => {
  if (logoFrameId !== undefined) return

  logoFrameId = window.requestAnimationFrame(() => {
    logoFrameId = undefined
    updateLogoVisibility()
  })
}

onMounted(() => {
  updateLogoVisibility()
  window.addEventListener('scroll', scheduleLogoVisibilityUpdate, { passive: true })
  window.addEventListener('resize', scheduleLogoVisibilityUpdate)
})

onBeforeUnmount(() => {
  if (logoFrameId !== undefined) window.cancelAnimationFrame(logoFrameId)
  window.removeEventListener('scroll', scheduleLogoVisibilityUpdate)
  window.removeEventListener('resize', scheduleLogoVisibilityUpdate)
  logoVisible.value = true
})
</script>

<template>
  <div class="flex flex-col">
    <LandingHeroSection :title="page.heroTitle" />
    <LandingAboutSection
      ref="aboutSectionRef"
      :title="page.aboutTitle"
      :text="page.aboutText"
      :video-type="page.aboutVideoType"
      :video-url="page.aboutVideoUrl"
      :video-file="page.aboutVideoFile"
      :hover-video-type="page.aboutHoverVideoType"
      :hover-video-url="page.aboutHoverVideoUrl"
      :hover-video-file="page.aboutHoverVideoFile"
    />
    <LandingFeaturedHeroSection
      v-if="isBannerEnabled('/')"
      :image="page.bannerImage"
      :mobile-image="page.bannerMobileImage"
      :link="page.bannerLink"
    />
    <LandingOurHeroesSection
      :title="page.heroesTitle"
      :description="page.heroesText"
      :heroes="heroes"
    />
    <LandingPlacesSection
      :title="page.placesTitle"
      :description="page.placesText"
      :places="page.places"
    />
    <LandingArticles
      :title="page.latestNewsTitle"
      :initial-data="page.latestArticles"
    />
    <LandingAudienceSection
      :title="page.audienceTitle"
      :intro="page.aboutBottomText"
      :cards="page.audienceCards"
    />
    <LandingContactSection
      :cta-title="page.ctaTitle"
      :form-title="page.ctaFormTitle"
      :form-description="page.ctaFormDescription"
    />
  </div>
</template>
