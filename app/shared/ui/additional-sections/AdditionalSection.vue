<script setup lang="ts">
import type { AdditionalSectionData } from '@shared/types/additional-section'
import { protectPrepositions } from '@shared/lib/typography'
import AdditionalSectionAccent from './AdditionalSectionAccent.vue'
import AdditionalSectionBiography from './AdditionalSectionBiography.vue'
import AdditionalSectionPortrait from './AdditionalSectionPortrait.vue'
import AdditionalSectionWide from './AdditionalSectionWide.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  section: AdditionalSectionData
  subjectName: string
  buttonHref?: string
  buttonLabel?: string
}>(), {
  buttonHref: '#interviews',
  buttonLabel: 'СМОТРЕТЬ ИНТЕРВЬЮ',
})

const attrs = useAttrs()
const biographyBlocks = computed(() => {
  if (props.section.type !== 'BIOGRAPHY') return []
  return [props.section.textOne, props.section.textTwo, props.section.textThree]
    .filter(Boolean)
    .map(protectPrepositions)
})
</script>

<template>
  <AdditionalSectionBiography
    v-if="section.type === 'BIOGRAPHY'"
    v-bind="attrs"
    :eyebrow="section.eyebrow"
    :title="protectPrepositions(section.title)"
    :image="section.image"
    :image-alt="subjectName"
    :blocks="biographyBlocks"
    :button-href="buttonHref"
    :button-label="buttonLabel"
  />
  <AdditionalSectionAccent
    v-else-if="section.type === 'ACCENT'"
    v-bind="attrs"
    :title="protectPrepositions(section.title)"
    :text-one="protectPrepositions(section.textOne)"
    :text-two="protectPrepositions(section.textTwo)"
  />
  <AdditionalSectionPortrait
    v-else-if="section.type === 'PORTRAIT'"
    v-bind="attrs"
    :title="protectPrepositions(section.title)"
    :text="protectPrepositions(section.text)"
    :aside-text="protectPrepositions(section.asideText)"
    :image="section.image"
    :image-alt="subjectName"
    :button-href="buttonHref"
    :button-label="buttonLabel"
  />
  <AdditionalSectionWide
    v-else
    v-bind="attrs"
    :title="protectPrepositions(section.title)"
    :text="protectPrepositions(section.text)"
    :bottom-text="protectPrepositions(section.bottomText)"
    :image="section.image"
    :image-alt="subjectName"
  />
</template>
