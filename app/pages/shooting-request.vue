<script setup lang="ts">
import type { ShootingPageData } from '@features/shooting-request/model/shooting-page.types'
import ShootingRequestPage from '@features/shooting-request/ui/ShootingRequestPage.vue'
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

const { data, error } = await useAsyncData('shooting-page', async () =>
  await $fetch<ShootingPageData>('/api/shooting-page'))

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 503,
    statusMessage: 'Shooting page is unavailable',
  })
}

const page = computed(() => data.value ?? fallbackPage)
const { banner } = useSiteBanner()
useSeoMeta({
  title: `${page.value.seoTitle} — ${config.public.siteName}`,
  description: page.value.seoDescription || config.public.siteDescription,
  ogTitle: `${page.value.seoTitle} — ${config.public.siteName}`,
  ogDescription: page.value.seoDescription || config.public.siteDescription,
})
</script>

<template>
  <div class="flex flex-col">
    <ShootingRequestPage
      :page="page"
      :banner-image="banner.image"
      :banner-mobile-image="banner.mobileImage"
      :banner-link="banner.link"
      :show-banner="Boolean(banner.image || banner.mobileImage)"
    />
  </div>
</template>
