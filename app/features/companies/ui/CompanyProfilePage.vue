<script setup lang="ts">
import type { CompanyProfileData } from '@features/companies/model/companies-page.types'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import PageMoreSection from '@shared/ui/page/PageMoreSection.vue'
import EntrepreneurStoryVariant01 from '@features/entrepreneurs/ui/profile/EntrepreneurStoryVariant01.vue'
import EntrepreneurStoryVariant03 from '@features/entrepreneurs/ui/profile/EntrepreneurStoryVariant03.vue'
import CompanyAddressesSection from './profile/CompanyAddressesSection.vue'
import CompanyAwardsSection from './profile/CompanyAwardsSection.vue'
import CompanyFactsSection from './profile/CompanyFactsSection.vue'
import CompanyFounderSection from './profile/CompanyFounderSection.vue'
import CompanyGallerySection from './profile/CompanyGallerySection.vue'
import CompanyManifestSection from './profile/CompanyManifestSection.vue'
import CompanyProfileHeroSection from './profile/CompanyProfileHeroSection.vue'
import CompanyRelatedSection from './profile/CompanyRelatedSection.vue'
import CompanySpecsSection from './profile/CompanySpecsSection.vue'
import CompanyTitleBandSection from './profile/CompanyTitleBandSection.vue'

const props = defineProps<{
  company: CompanyProfileData
  success: boolean
  error: boolean
}>()

const sectionOrder = computed(() => new Map(props.company.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => isSectionVisible(props.company.sectionVisibility, key)
const ownerBiographyBlocks = computed(() => props.company.owner?.biographyBlocks.filter(Boolean) ?? [])
</script>

<template>
  <article class="flex flex-col overflow-x-clip bg-bg text-text">
    <CompanyProfileHeroSection
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      :title-top="company.heroTitleTop"
      :title-bottom="company.heroTitleBottom"
      :teaser="company.heroTeaser"
      :marquee="company.heroMarquee"
      :name="company.name"
    />

    <CompanyManifestSection
      v-if="isVisible('manifest')"
      :style="sectionStyle('manifest')"
      :title="company.manifestTitle"
      :text-one="company.manifestTextOne"
      :text-two="company.manifestTextTwo"
      :text-three="company.manifestTextThree"
      :background-image="company.manifestBackgroundImage"
      :square-image="company.manifestSquareImage"
      :image-alt="company.name"
    />

    <CompanyTitleBandSection
      v-if="isVisible('titleBand')"
      :style="sectionStyle('titleBand')"
    />

    <EntrepreneurStoryVariant03
      v-if="isVisible('about')"
      id="about"
      :style="sectionStyle('about')"
      :title="company.aboutTitle"
      :text="company.aboutText"
      :aside-text="company.aboutAsideText"
      :image="company.aboutPhoto"
      :image-alt="company.name"
      button-href="#interview"
    />

    <CompanyFounderSection
      v-if="isVisible('founder') && company.owner"
      :style="sectionStyle('founder')"
      :owner-name="company.owner.name"
      :owner-title="company.owner.title"
      :owner-quote="company.owner.quote"
      :owner-hero-right-teaser="company.owner.heroRightTeaser"
      :owner-hero-bottom-right-teaser="company.owner.heroBottomRightTeaser"
      :photo="company.founderPhoto"
    />

    <EntrepreneurStoryVariant01
      v-if="isVisible('ownerBiography') && company.owner && ownerBiographyBlocks.length"
      id="owner-biography"
      :style="sectionStyle('ownerBiography')"
      eyebrow="БИОГРАФИЯ"
      :title="company.owner.name"
      :image="company.owner.biographyPhoto"
      :image-alt="company.owner.name"
      :blocks="ownerBiographyBlocks"
      :button-href="ROUTES.ENTREPRENEUR(company.owner.slug)"
      button-label="ЧИТАТЬ ПОДРОБНЕЕ"
    />

    <CompanySpecsSection
      v-if="isVisible('specs') && company.specsItems.length"
      :style="sectionStyle('specs')"
      :title="company.specsTitle"
      :description="company.specsDescription"
      :items="company.specsItems"
    />

    <CompanyAddressesSection
      v-if="isVisible('addresses')"
      :style="sectionStyle('addresses')"
      :name="company.name"
      :map-coordinates="company.mapCoordinates"
    />

    <CompanyAwardsSection
      v-if="isVisible('awards') && company.awardsEnabled && company.awards.length"
      :style="sectionStyle('awards')"
      :title="company.awardsTitle"
      :description="company.awardsDescription"
      :awards="company.awards"
    />

    <CompanyFactsSection
      v-if="isVisible('facts')"
      :style="sectionStyle('facts')"
      :title="company.factsTitle"
      :subtitle="company.factsSubtitle"
      :text-one="company.factsTextOne"
      :text-two="company.factsTextTwo"
      :image="company.factsPhoto"
      :image-alt="company.name"
    />

    <CompanyGallerySection
      v-if="isVisible('gallery') && company.galleryImages.length"
      :style="sectionStyle('gallery')"
      :images="company.galleryImages"
      :image-alt-prefix="company.name"
    />

    <PageMoreSection
      v-if="isVisible('more')"
      :style="sectionStyle('more')"
      :items="company.moreItems"
      :image="company.morePhoto"
      :image-alt="company.name"
    />

    <CompanyRelatedSection
      v-if="isVisible('related') && company.related.length"
      :style="sectionStyle('related')"
      :title="company.relatedTitle"
      :companies="company.related"
    />

    <LandingContactSection
      v-if="isVisible('cta')"
      :style="sectionStyle('cta')"
      cta-title="Стать участником"
      form-title="Заполните ваши данные для связи"
      form-description="Расскажем о формате съемки и ответим на вопросы."
    />

    <PageBannerSection
      v-if="isVisible('banner')"
      :style="sectionStyle('banner')"
      :desktop-image="company.bannerImage"
      :mobile-image="company.bannerMobileImage"
      :href="company.bannerLink || ROUTES.ENTREPRENEURS"
    />

    <p v-if="success" class="fixed bottom-5 right-5 z-50 bg-text px-5 py-4 font-sans text-sm leading-5 text-white" role="status">
      Заявка отправлена.
    </p>
    <p v-if="error" class="fixed bottom-5 right-5 z-50 bg-accent px-5 py-4 font-sans text-sm leading-5 text-white" role="alert">
      Не удалось отправить заявку.
    </p>
  </article>
</template>
