<script setup lang="ts">
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'
import { ROUTES } from '@shared/navigation'


// TODO исправть стрелку на корректный компонент
defineProps<{
  company: CompanyCatalogItem
}>()
</script>

<template>
  <NuxtLink
    :to="ROUTES.COMPANY(company.slug)"
    class="group overflow-hidden border border-border-strong bg-surface transition-transform duration-300 hover:-translate-y-1"
  >
    <div class="relative aspect-[4/5] overflow-hidden bg-bg">
      <img
        :src="company.coverImage || '/images/placeholder.svg'"
        :alt="company.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      >
      <div class="absolute inset-0 bg-linear-to-t from-text/75 via-transparent to-transparent" />
      <h2 class="absolute bottom-5 left-5 right-5 font-display text-[clamp(2rem,5vw,3.4rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text-on-accent">
        {{ company.name }}
      </h2>
    </div>

    <div class="flex items-center justify-between gap-4 border-t border-border-strong px-5 py-4">
      <p class="font-sans text-sm uppercase leading-5 text-text-muted">
        {{ company.type }}
      </p>
      <span class="font-sans text-sm uppercase leading-4 text-accent">
        [ ↗ ]
      </span>
    </div>
  </NuxtLink>
</template>
