<script setup lang="ts">
import type { LandingPageData } from '@features/landing/model/landing.data'
import { toLandingHeroCard } from '@features/entrepreneurs/model/entrepreneur-card'
import LandingAboutSection from '@features/landing/ui/sections/LandingAboutSection.vue'
import LandingArticles from '@features/landing/ui/sections/LandingArticles.vue'
import LandingAudienceSection from '@features/landing/ui/sections/LandingAudienceSection.vue'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import LandingOurHeroesSection from '@features/landing/ui/sections/LandingOurHeroesSection.vue'
import LandingPlacesSection from '@features/landing/ui/sections/LandingPlacesSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const props = defineProps<{
  page: LandingPageData
  city?: string
}>()

const heroes = computed(() => props.page.entrepreneurs.map(toLandingHeroCard))

const { isEnabled: isBannerEnabled } = useSiteBanner()
</script>

<template>
  <div class="flex flex-col">
    <LandingHeroSection
      :title="page.heroTitle"
      :trademark-text="page.heroTrademarkText"
      brand-lockup
    />
    <LandingAboutSection
      :title="page.aboutTitle"
      :text="page.aboutText"
      :banner-image="page.bannerImage"
      :banner-mobile-image="page.bannerMobileImage"
      :banner-link="page.bannerLink"
      :show-banner="isBannerEnabled('/')"
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
      :description="page.latestNewsDescription"
      :initial-data="page.latestArticles"
      :city="city"
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
