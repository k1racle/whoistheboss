<script setup lang="ts">
import type { BlogRelatedCompany, BlogRelatedEntrepreneur } from '@features/blog/model/blog.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import BlogRelatedEntrepreneurCard from '@features/blog/ui/BlogRelatedEntrepreneurCard.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

defineProps<{
  title: string
  entrepreneurs: BlogRelatedEntrepreneur[]
  companies: BlogRelatedCompany[]
}>()
</script>

<template>
  <section id="related" class="bg-bg pb-[110px] pt-40 lg:pb-[196px] lg:pt-[320px]">
    <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
      <SectionTitle class="text-center">
        {{ title }}
      </SectionTitle>

      <div
        v-if="entrepreneurs.length"
        class="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-[86px] lg:gap-8"
      >
        <BlogRelatedEntrepreneurCard
          v-for="entrepreneur in entrepreneurs"
          :key="entrepreneur.slug"
          :entrepreneur="entrepreneur"
        />
      </div>

      <div
        v-if="companies.length"
        class="mt-[72px] grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-[94px] xl:grid-cols-3 xl:gap-8"
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
