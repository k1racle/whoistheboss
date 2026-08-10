<script setup lang="ts">
import type { BlogRelatedCompany, BlogRelatedEntrepreneur } from '@features/blog/model/blog.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import BlogRelatedEntrepreneurCard from '@features/blog/ui/BlogRelatedEntrepreneurCard.vue'
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  entrepreneurs: BlogRelatedEntrepreneur[]
  companies: BlogRelatedCompany[]
}>()

const protectedTitle = computed(() => protectPrepositions(props.title))
const visibleEntrepreneurs = computed(() => props.entrepreneurs.slice(0, 3))
const visibleCompanies = computed(() => props.companies.slice(0, 3))
</script>

<template>
  <section id="related" class="bg-bg pb-[110px] pt-40 lg:pb-[196px] lg:pt-[320px]">
    <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
      <SectionTitle class="text-center">
        {{ protectedTitle }}
      </SectionTitle>

      <div
        v-if="visibleEntrepreneurs.length"
        class="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-[86px] lg:gap-8"
      >
        <BlogRelatedEntrepreneurCard
          v-for="entrepreneur in visibleEntrepreneurs"
          :key="entrepreneur.slug"
          :entrepreneur="entrepreneur"
          :show-text="false"
        />
      </div>

      <div
        v-if="visibleCompanies.length"
        class="mt-[72px] grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-[94px] xl:grid-cols-3 xl:gap-8"
      >
        <CompanyCatalogCard
          v-for="company in visibleCompanies"
          :key="company.slug"
          :company="company"
        />
      </div>
    </div>
  </section>
</template>
