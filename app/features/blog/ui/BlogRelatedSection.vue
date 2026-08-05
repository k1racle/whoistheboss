<script setup lang="ts">
import type { BlogRelatedCompany, BlogRelatedEntrepreneur } from '@features/blog/model/blog.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import EntrepreneurPosterCard from '@shared/ui/cards/EntrepreneurPosterCard.vue'

defineProps<{
  title: string
  entrepreneurs: BlogRelatedEntrepreneur[]
  companies: BlogRelatedCompany[]
}>()
</script>

<template>
  <section class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 class="font-display text-[clamp(3rem,9vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          {{ title }}
        </h2>
        <p class="max-w-[34rem] font-sans text-base leading-7 text-text/76 sm:text-lg">
          Подборка героев и компаний, которые стоит открыть следующими.
        </p>
      </div>

      <div
        v-if="entrepreneurs.length"
        class="grid gap-5 xl:grid-cols-3"
      >
        <EntrepreneurPosterCard
          v-for="entrepreneur in entrepreneurs"
          :key="entrepreneur.slug"
          :entrepreneur="entrepreneur"
        />
      </div>

      <div
        v-if="companies.length"
        class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
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
