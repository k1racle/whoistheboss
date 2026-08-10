<script setup lang="ts">
import type { ShootingPageData } from '@features/shooting-request/model/shooting-page.types'
import ShootingRequestPage from '@features/shooting-request/ui/ShootingRequestPage.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const config = useRuntimeConfig()

const fallbackPage: ShootingPageData = {
  heroTitle: 'КАК ПРИНЯТЬ\nУЧАСТИЕ',
  seoTitle: 'Стать героем',
  seoDescription: config.public.siteDescription,
  aboutTitle: 'О ПРОЕКТЕ',
  aboutText: 'Мы рассказываем личные истории предпринимателей через их дело.',
  aboutBottomText: 'Проект помогает увидеть не только бизнес, но и человека, который его создал.',
  aboutVideoType: 'EMBED',
  aboutVideoUrl: '',
  aboutVideoFile: '',
  stagesTitle: 'ЭТАПЫ',
  stages: [],
  faqTitle: 'FAQ',
  faqItems: [],
  sectionOrder: ['hero', 'about', 'stages', 'faq', 'cta'],
  sectionVisibility: {},
}

const { data } = await useAsyncData('shooting-page', async () => {
  try {
    return await $fetch<ShootingPageData>('/api/shooting-page')
  }
  catch {
    return fallbackPage
  }
})

const page = computed(() => data.value ?? fallbackPage)
const { banner, isEnabled: isBannerEnabled } = useSiteBanner()
useSeoMeta({
  title: `${page.value.seoTitle} — ${config.public.siteName}`,
  description: page.value.seoDescription || config.public.siteDescription,
  ogTitle: `${page.value.seoTitle} — ${config.public.siteName}`,
  ogDescription: page.value.seoDescription || config.public.siteDescription,
})
</script>

<template>
  <div class="flex flex-col">
    <ShootingRequestPage :page="page" />
    <PageBannerSection
      v-if="isBannerEnabled('/shooting-request')"
      :desktop-image="banner.image"
      :mobile-image="banner.mobileImage"
      :href="banner.link"
    />
  </div>
</template>
