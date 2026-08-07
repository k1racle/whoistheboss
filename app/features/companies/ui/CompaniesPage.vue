<script setup lang="ts">
import type { CompaniesPageData } from '@features/companies/model/companies-page.types'
import CompaniesAboutSection from '@features/companies/ui/CompaniesAboutSection.vue'
import CompaniesCatalogSection from '@features/companies/ui/CompaniesCatalogSection.vue'
import CompaniesHeroSection from '@features/companies/ui/CompaniesHeroSection.vue'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import { ROUTES } from '@shared/navigation'
import { isSectionVisible } from '@shared/lib/section-config'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<{
  page: CompaniesPageData
  success: boolean
  error: boolean
}>()

const sectionOrder = computed(() => new Map(props.page.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => isSectionVisible(props.page.sectionVisibility, key)
</script>

<template>
  <div class="flex flex-col overflow-hidden bg-bg">
    <CompaniesHeroSection
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      :title="page.heroTitle"
    />

    <CompaniesAboutSection
      v-if="isVisible('about')"
      :style="sectionStyle('about')"
      :title="page.aboutTitle"
      :text="page.aboutText"
    />

    <CompaniesCatalogSection
      v-if="isVisible('catalog')"
      :style="sectionStyle('catalog')"
      :companies="page.companies"
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
      :desktop-image="page.bannerImage"
      :mobile-image="page.bannerMobileImage"
      :href="page.bannerLink || ROUTES.ENTREPRENEURS"
    />

    <p
      v-if="success"
      class="fixed bottom-5 right-5 z-50 bg-text px-5 py-4 font-sans text-sm leading-5 text-white"
      role="status"
    >
      Заявка отправлена.
    </p>
    <p
      v-if="error"
      class="fixed bottom-5 right-5 z-50 bg-accent px-5 py-4 font-sans text-sm leading-5 text-white"
      role="alert"
    >
      Не удалось отправить заявку.
    </p>
  </div>
</template>
