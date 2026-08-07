<script setup lang="ts">
import type { LandingPageData } from '@features/landing/model/landing.data'
import LandingAboutSection from '@features/landing/ui/sections/LandingAboutSection.vue'
import LandingArticles from '@features/landing/ui/sections/LandingArticles.vue'
import LandingAudienceSection from '@features/landing/ui/sections/LandingAudienceSection.vue'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import LandingFeaturedHeroSection from '@features/landing/ui/sections/LandingFeaturedHeroSection.vue'
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import LandingOurHeroesSection from '@features/landing/ui/sections/LandingOurHeroesSection.vue'
import LandingPlacesSection from '@features/landing/ui/sections/LandingPlacesSection.vue'
import { useSiteHeader } from '@shared/ui/header/useSiteHeader'

defineProps<{
  page: LandingPageData
}>()

const { logoVisible } = useSiteHeader()

const aboutSectionRef = ref<InstanceType<typeof LandingAboutSection> | null>(null)

const updateLogoVisibility = () => {
  const logoEl = aboutSectionRef.value?.logoRef
  if (!logoEl) return

  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0
  const logoTop = logoEl.getBoundingClientRect().top

  logoVisible.value = logoTop < headerHeight
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
  <div class="flex flex-col">
    <LandingHeroSection :title="page.heroTitle" />
    <LandingAboutSection
      ref="aboutSectionRef"
      :title="page.aboutTitle"
      :text="page.aboutText"
    />
    <LandingFeaturedHeroSection
      :image="page.bannerImage"
      :mobile-image="page.bannerMobileImage"
      :link="page.bannerLink"
    />
    <LandingOurHeroesSection
      :title="page.heroesTitle"
      :description="page.heroesText"
    />
    <LandingPlacesSection
      :title="page.placesTitle"
      :description="page.placesText"
    />
    <LandingArticles :title="page.latestNewsTitle" />
    <LandingAudienceSection
      :title="page.audienceTitle"
      :intro="page.aboutBottomText"
    />
    <LandingContactSection
      :cta-title="page.ctaTitle"
      :form-title="page.ctaFormTitle"
      :form-description="page.ctaFormDescription"
    />
  </div>
</template>
