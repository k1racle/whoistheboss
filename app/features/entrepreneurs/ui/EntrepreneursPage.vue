<script setup lang="ts">
import type { EntrepreneursPageData } from '@features/entrepreneurs/model/entrepreneur.types'
import type { LandingAudienceCard, LandingHeroCard } from '@features/landing/model/landing.data'
import EntrepreneursAudienceSection from '@features/entrepreneurs/ui/EntrepreneursAudienceSection.vue'
import LandingContactSection from '@features/landing/ui/sections/LandingContactSection.vue'
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import LandingOurHeroesSection from '@features/landing/ui/sections/LandingOurHeroesSection.vue'
import { ROUTES } from '@shared/navigation'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<{
  page: EntrepreneursPageData
  success: boolean
  error: boolean
}>()

const sectionOrder = computed(() => new Map(props.page.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => props.page.sectionVisibility[key] !== false

const audienceCards = computed<LandingAudienceCard[]>(() => props.page.audienceCards.map(card => ({
  id: card.id,
  title: card.title,
  description: card.description || undefined,
  hoverTitle: card.hoverTitle || undefined,
  hoverDescription: card.hoverDescription || undefined,
})))

const heroes = computed<LandingHeroCard[]>(() => props.page.entrepreneurs.map(entrepreneur => ({
  id: entrepreneur.slug,
  name: entrepreneur.name,
  role: entrepreneur.title,
  company: '',
  image: entrepreneur.photo || '/images/placeholder.svg',
  imageHover: entrepreneur.hoverPhoto || entrepreneur.photo || '/images/placeholder.svg',
  imageAlt: `Карточка героя ${entrepreneur.name}`,
  href: ROUTES.ENTREPRENEUR(entrepreneur.slug),
})))
</script>

<template>
  <div class="flex flex-col overflow-hidden bg-bg">
    <LandingHeroSection
      v-if="isVisible('hero')"
      :style="sectionStyle('hero')"
      title="Кто здесь главный?"
    />

    <EntrepreneursAudienceSection
      v-if="isVisible('audience')"
      :style="sectionStyle('audience')"
      :cards="audienceCards"
    >
      <template #intro>
        <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.03em] text-text">
          Наши герои
        </h2>
        <p class="mt-6 max-w-[680px] font-sans text-base leading-6 text-text/80 sm:text-xl sm:leading-7">
          Здесь собраны предприниматели, руководители и основатели компаний, которые создают проекты и развивают бизнес через личное участие.
        </p>
      </template>
    </EntrepreneursAudienceSection>

    <LandingOurHeroesSection
      v-if="isVisible('heroes')"
      :style="sectionStyle('heroes')"
      section-id="heroes"
      title="Герои"
      description="Мы убеждены, что каждый успешный бизнес начинается с человека. Поэтому рассказываем не только о компаниях и проектах, но прежде всего о людях, которые их создали."
      :heroes="heroes"
      :show-more="false"
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
      :href="page.bannerLink"
    />

    <p v-if="success" class="fixed bottom-5 right-5 z-50 bg-text px-5 py-4 text-sm text-white" role="status">Заявка отправлена.</p>
    <p v-if="error" class="fixed bottom-5 right-5 z-50 bg-accent px-5 py-4 text-sm text-white" role="alert">Не удалось отправить заявку.</p>
  </div>
</template>
