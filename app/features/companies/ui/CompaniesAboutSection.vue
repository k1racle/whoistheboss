<script setup lang="ts">
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  text: string
}>()

const paragraphs = computed(() =>
  props.text
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean),
)
const protectedTitle = computed(() => protectPrepositions(props.title))
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-5 pb-20 pt-[60px] sm:px-6 lg:px-10 lg:pb-[72px] lg:pt-[76px]">
      <SectionTitle>
        {{ protectedTitle }}
      </SectionTitle>

      <div class="mt-12 max-w-[720px] space-y-4 font-sans text-base leading-4 text-text lg:mt-[76px] lg:w-1/2">
        <p
          v-for="paragraph in paragraphs"
          :key="paragraph"
        >
          {{ paragraph }}
        </p>
      </div>
    </div>
  </section>
</template>
