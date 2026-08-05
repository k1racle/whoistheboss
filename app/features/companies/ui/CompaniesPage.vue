<script setup lang="ts">
import type { Component } from 'vue'
import type { CompaniesPageData } from '@features/companies/model/companies-page.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<{
  page: CompaniesPageData
  success?: boolean
  error?: boolean
}>()

// TODO переделать под компоненты и выводить не темплейты а компоненты???

const HeroSection = {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  template: `
    <section class="flex min-h-[calc(100svh-72px)] items-center bg-bg px-4 py-12 sm:px-6 lg:px-10">
      <div class="mx-auto w-full max-w-[1920px]">
        <h1 class="font-display text-[clamp(4rem,13vw,11rem)] font-black uppercase leading-[0.84] tracking-[-0.05em] text-text whitespace-pre-line">{{ title }}</h1>
      </div>
    </section>
  `,
} satisfies Component

const AboutSection = {
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  template: `
    <section class="bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
        <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">{{ title }}</h2>
        <div class="grid gap-5 font-sans text-base leading-7 text-text/82 sm:text-lg">
          <p v-for="paragraph in text.split(/\\n\\s*\\n/).filter(Boolean)" :key="paragraph">{{ paragraph }}</p>
        </div>
      </div>
    </section>
  `,
} satisfies Component

const CatalogSection = {
  components: {
    CompanyCatalogCard,
  },
  props: {
    companies: { type: Array, required: true },
  },
  template: `
    <section class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">Компании</h2>
          <p class="max-w-[34rem] font-sans text-sm leading-6 text-text-muted sm:text-base">Бизнесы, проекты и места, за которыми стоят герои «Кто здесь главный?».</p>
        </div>

        <div v-if="companies.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <CompanyCatalogCard
            v-for="company in companies"
            :key="company.slug"
            :company="company"
          />
        </div>

        <p v-else class="border border-border-strong bg-surface px-5 py-10 font-sans text-base leading-6 text-text-muted">
          Компании скоро появятся.
        </p>
      </div>
    </section>
  `,
} satisfies Component

interface SectionEntry {
  key: string
  component: Component
  props: Record<string, unknown>
}

const sectionMap = computed<Record<string, SectionEntry>>(() => ({
  hero: {
    key: 'hero',
    component: HeroSection,
    props: {
      title: props.page.heroTitle,
    },
  },
  about: {
    key: 'about',
    component: AboutSection,
    props: {
      title: props.page.aboutTitle,
      text: props.page.aboutText,
    },
  },
  catalog: {
    key: 'catalog',
    component: CatalogSection,
    props: {
      companies: props.page.companies,
    },
  },
  cta: {
    key: 'cta',
    component: ShootingLeadSection,
    props: {
      success: props.success,
      error: props.error,
      redirectPath: '/companies?success=1',
      title: 'Стать героем',
      description: 'Оставьте заявку, если хотите рассказать о своем проекте и стать частью медиапортала.',
      headline: 'Готовы\nк обсуждению\nпроекта?',
    },
  },
  banner: {
    key: 'banner',
    component: PageBannerSection,
    props: {
      desktopImage: props.page.bannerImage,
      mobileImage: props.page.bannerMobileImage,
      href: props.page.bannerLink || ROUTES.ENTREPRENEURS,
      fallbackText: 'ЗДЕСЬ БУДЕТ БАННЕР\nО НОВОМ ВЫПУСКЕ',
    },
  },
}))

const orderedSections = computed(() =>
  props.page.sectionOrder
    .map((key) => sectionMap.value[key])
    .filter((section): section is SectionEntry => Boolean(section))
    .filter((section) => isSectionVisible(props.page.sectionVisibility, section.key))
)
</script>

<template>
  <div class="flex flex-col">
    <component
      :is="section.component"
      v-for="section in orderedSections"
      :key="section.key"
      v-bind="section.props"
    />
  </div>
</template>
