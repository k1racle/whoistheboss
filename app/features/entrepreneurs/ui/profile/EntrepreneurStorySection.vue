<script setup lang="ts">
import type { EntrepreneurStorySection } from '@features/entrepreneurs/model/entrepreneur.types'
import EntrepreneurStoryVariant01 from './EntrepreneurStoryVariant01.vue'
import EntrepreneurStoryVariant02 from './EntrepreneurStoryVariant02.vue'
import EntrepreneurStoryVariant03 from './EntrepreneurStoryVariant03.vue'
import EntrepreneurStoryVariant04 from './EntrepreneurStoryVariant04.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  section: EntrepreneurStorySection
  entrepreneurName: string
}>()

const attrs = useAttrs()
const biographyBlocks = computed(() => {
  if (props.section.type !== 'BIOGRAPHY') return []
  return [props.section.textOne, props.section.textTwo, props.section.textThree].filter(Boolean)
})
</script>

<template>
  <EntrepreneurStoryVariant01
    v-if="section.type === 'BIOGRAPHY'"
    v-bind="attrs"
    :eyebrow="section.eyebrow"
    :title="section.title || entrepreneurName"
    :image="section.image"
    :image-alt="entrepreneurName"
    :blocks="biographyBlocks"
  />
  <EntrepreneurStoryVariant02
    v-else-if="section.type === 'ACCENT'"
    v-bind="attrs"
    :title="section.title"
    :text-one="section.textOne"
    :text-two="section.textTwo"
  />
  <EntrepreneurStoryVariant03
    v-else-if="section.type === 'PORTRAIT'"
    v-bind="attrs"
    :title="section.title"
    :text="section.text"
    :aside-text="section.asideText"
    :image="section.image"
    :image-alt="entrepreneurName"
  />
  <EntrepreneurStoryVariant04
    v-else
    v-bind="attrs"
    :title="section.title"
    :text="section.text"
    :bottom-text="section.bottomText"
    :image="section.image"
    :image-alt="entrepreneurName"
  />
</template>
