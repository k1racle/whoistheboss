<script setup lang="ts">
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'

defineProps<{
  companies: CompanyCatalogItem[]
}>()
</script>

<template>
  <section class="bg-bg">
    <div class="mx-auto w-full max-w-[1920px] px-5 pb-[60px] pt-5 sm:px-6 lg:px-10 lg:pb-20 lg:pt-10">
      <div
        v-if="companies.length"
        class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8"
      >
        <CompanyCatalogCard
          v-for="(company, index) in companies"
          :key="company.slug"
          :company="company"
          :priority="index < 3"
        />
      </div>

      <p
        v-else
        class="min-h-80 py-12 font-sans text-sm uppercase leading-5 text-text/55"
      >
        Компании скоро появятся.
      </p>
    </div>
  </section>
</template>
