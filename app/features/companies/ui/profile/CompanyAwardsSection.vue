<script setup lang="ts">
import type { CompanyAwardItem } from '@features/companies/model/companies-page.types'
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  description: string
  awards: CompanyAwardItem[]
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
const protectedDescription = computed(() => protectPrepositions(props.description))
const visibleAwards = computed(() => props.awards.length < 3
  ? props.awards
  : props.awards.slice(0, Math.floor(props.awards.length / 3) * 3))
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto w-full max-w-[1920px]">
      <div class="max-w-[970px]">
        <SectionTitle class="m-0">
          {{ protectedTitle }}
        </SectionTitle>
        <p v-if="description" class="mt-4 max-w-[640px] whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ protectedDescription }}
        </p>
      </div>

      <div class="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-20 lg:gap-8">
        <article
          v-for="(award, index) in visibleAwards"
          :key="`${award.nominations}-${index}`"
          class="flex min-h-[320px] min-w-0 flex-col justify-between overflow-hidden bg-accent p-5 text-text-on-accent lg:aspect-square lg:min-h-0 lg:w-full lg:p-7"
        >
          <div class="flex items-start justify-between gap-5">
            <p class="m-0 whitespace-pre-line font-sans text-base uppercase leading-4">
              {{ protectPrepositions(award.nominations) }}
            </p>
            <img
              v-if="award.icon"
              :src="award.icon"
              alt=""
              class="h-[90px] w-[82px] shrink-0 object-contain"
            >
          </div>
          <strong class="block min-w-0 max-w-full whitespace-pre-line font-display text-[56px] font-black uppercase leading-[0.88] tracking-[-0.03em] [overflow-wrap:anywhere] hyphens-auto md:text-[clamp(40px,5vw,56px)] lg:text-[clamp(48px,5vw,96px)]">
            {{ protectPrepositions(award.place) }}
          </strong>
        </article>
      </div>
    </div>
  </section>
</template>
