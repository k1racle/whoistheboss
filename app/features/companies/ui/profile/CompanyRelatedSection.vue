<script setup lang="ts">
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'

defineProps<{
  title: string
  companies: CompanyCatalogItem[]
}>()
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto w-full max-w-[1920px]">
      <h2 class="m-0 text-center font-display text-[clamp(48px,12vw,80px)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-text lg:leading-none">
        {{ title }}
      </h2>

      <div v-if="companies.length" class="mt-12 md:hidden">
        <LandingSlider :items-count="companies.length" aria-label="Читайте также">
          <CompanyCatalogCard
            v-for="company in companies"
            :key="company.slug"
            :company="company"
            class="min-w-[82%] shrink-0 snap-center"
          />
        </LandingSlider>
      </div>

      <div
        v-if="companies.length"
        class="mt-[72px] hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 xl:grid-cols-3 xl:gap-8"
      >
        <CompanyCatalogCard
          v-for="company in companies"
          :key="company.slug"
          :company="company"
        />
      </div>
    </div>
  </section>
</template>
