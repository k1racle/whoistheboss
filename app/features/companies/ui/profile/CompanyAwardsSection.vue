<script setup lang="ts">
import type { CompanyAwardItem } from '@features/companies/model/companies-page.types'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

defineProps<{
  title: string
  description: string
  awards: CompanyAwardItem[]
}>()
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto w-full max-w-[1920px]">
      <div class="max-w-[970px]">
        <SectionTitle class="m-0">
          {{ title }}
        </SectionTitle>
        <p v-if="description" class="mt-4 max-w-[640px] whitespace-pre-line font-sans text-base leading-4 text-text">
          {{ description }}
        </p>
      </div>

      <div class="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-20 lg:gap-8">
        <article
          v-for="(award, index) in awards"
          :key="`${award.nominations}-${index}`"
          class="flex min-h-[320px] flex-col justify-between bg-accent p-5 text-text-on-accent lg:min-h-[430px] lg:p-7"
        >
          <div class="flex items-start justify-between gap-5">
            <p class="m-0 whitespace-pre-line font-sans text-base uppercase leading-4">
              {{ award.nominations }}
            </p>
            <div class="flex shrink-0 items-start gap-2">
              <img
                v-if="award.icon"
                :src="award.icon"
                alt=""
                class="h-16 w-16 shrink-0 object-contain"
              >
              <div class="flex w-[82px] shrink-0 flex-col" aria-hidden="true">
                <img src="/images/reward-white.svg" alt="" class="h-[83px] w-[82px] object-contain">
                <img src="/images/reward-black.svg" alt="" class="h-[90px] w-[82px] object-contain">
              </div>
            </div>
          </div>
          <strong class="whitespace-pre-line font-display text-[56px] font-black uppercase leading-[0.88] tracking-[-0.03em] lg:text-[96px]">
            {{ award.place }}
          </strong>
        </article>
      </div>
    </div>
  </section>
</template>
