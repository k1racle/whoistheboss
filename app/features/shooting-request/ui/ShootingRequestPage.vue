<script setup lang="ts">
import type { Component } from 'vue'
import type { ShootingPageData } from '@features/shooting-request/model/shooting-page.types'
import ShootingAboutSection from '@features/shooting-request/ui/ShootingAboutSection.vue'
import ShootingFaqSection from '@features/shooting-request/ui/ShootingFaqSection.vue'
import ShootingHeroSection from '@features/shooting-request/ui/ShootingHeroSection.vue'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import ShootingStagesSection from '@features/shooting-request/ui/ShootingStagesSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'

const props = defineProps<{
  page: ShootingPageData
  success?: boolean
  error?: boolean
}>()

interface SectionEntry {
  key: string
  component: Component
  props: Record<string, unknown>
}

const sectionMap = computed<Record<string, SectionEntry>>(() => ({
  hero: {
    key: 'hero',
    component: ShootingHeroSection,
    props: { title: props.page.heroTitle },
  },
  about: {
    key: 'about',
    component: ShootingAboutSection,
    props: {
      title: props.page.aboutTitle,
      text: props.page.aboutText,
      bottomText: props.page.aboutBottomText,
      videoType: props.page.aboutVideoType,
      videoUrl: props.page.aboutVideoUrl,
      videoFile: props.page.aboutVideoFile,
    },
  },
  stages: {
    key: 'stages',
    component: ShootingStagesSection,
    props: {
      title: props.page.stagesTitle,
      stages: props.page.stages,
    },
  },
  faq: {
    key: 'faq',
    component: ShootingFaqSection,
    props: {
      title: props.page.faqTitle,
      items: props.page.faqItems,
    },
  },
  cta: {
    key: 'cta',
    component: ShootingLeadSection,
    props: {
      success: props.success,
      error: props.error,
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
