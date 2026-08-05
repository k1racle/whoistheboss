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
  <section class="border-t border-black/10 bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <div class="grid gap-4 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1fr)] lg:items-end">
        <h2 class="font-display text-[clamp(3rem,9vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          {{ title }}
        </h2>
        <p class="max-w-[34rem] text-base leading-7 text-text/72 sm:text-lg">
          Подборка героев и компаний, которых стоит открыть следующими.
        </p>
      </div>

      <div
        v-if="entrepreneurs.length"
        class="grid gap-6 xl:grid-cols-3"
      >
        <EntrepreneurPosterCard
          v-for="entrepreneur in entrepreneurs"
          :key="entrepreneur.slug"
          :entrepreneur="entrepreneur"
        />
      </div>

      <div
        v-if="companies.length"
        class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
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
