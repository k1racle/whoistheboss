<script setup lang="ts">
import type { ShootingPageData } from '@features/shooting-request/model/shooting-page.types'
import ShootingRequestPage from '@features/shooting-request/ui/ShootingRequestPage.vue'
import { SEO_FALLBACK_DESCRIPTION } from '@shared/seo/brand'
import { useManagedSeo } from '@shared/seo/use-managed-seo'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const fallbackPage: ShootingPageData = {
  heroTitle: 'КАК ПРИНЯТЬ\nУЧАСТИЕ',
  seoTitle: 'Стать героем проекта | МАРШРУТ ПОСТРОЕН МЕДИАГИД',
  seoDescription: 'Как стать героем МАРШРУТ ПОСТРОЕН МЕДИАГИД: этапы участия, съёмка интервью, подготовка биографии, страницы предпринимателя и материалов о бизнесе.',
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
useManagedSeo({
  title: page.value.seoTitle,
  description: page.value.seoDescription || SEO_FALLBACK_DESCRIPTION,
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
