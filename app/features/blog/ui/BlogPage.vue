<script setup lang="ts">
import type { BlogPageData } from '@features/blog/model/blog.types'
import BlogLatestSection from '@features/blog/ui/BlogLatestSection.vue'
import BlogMainNewsSection from '@features/blog/ui/BlogMainNewsSection.vue'
import BlogPopularSection from '@features/blog/ui/BlogPopularSection.vue'
import BlogRelatedSection from '@features/blog/ui/BlogRelatedSection.vue'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'

const props = defineProps<{
  page: BlogPageData
  success: boolean
  error: boolean
}>()

const sectionOrder = computed(() => new Map(props.page.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => isSectionVisible(props.page.sectionVisibility, key)
</script>

<template>
  <div class="flex flex-col overflow-hidden bg-bg">
    <LandingHeroSection
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      :title="page.heroTitle"
    />

    <BlogPopularSection
      v-if="isVisible('popular')"
      :style="sectionStyle('popular')"
      :title="page.popularTitle"
      :articles="page.featuredArticles"
    />

    <BlogMainNewsSection
      v-if="isVisible('mainNews')"
      :style="sectionStyle('mainNews')"
      :cards="page.mainCards"
    />

    <BlogLatestSection
      v-if="isVisible('latestNews')"
      :style="sectionStyle('latestNews')"
      :title="page.latestTitle"
      :description="page.latestDescription"
      :articles="page.latestArticles"
    />

    <BlogRelatedSection
      v-if="isVisible('related')"
      :style="sectionStyle('related')"
      :title="page.relatedTitle"
      :entrepreneurs="page.relatedEntrepreneurs"
      :companies="page.relatedCompanies"
    />

    <LandingContactSection
      v-if="isVisible('cta')"
      :style="sectionStyle('cta')"
      cta-title="Стать участником"
      form-title="Заполните ваши данные для связи"
      form-description="Расскажем о формате съёмки и ответим на вопросы."
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
