<script setup lang="ts">
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'
import { ROUTES } from '@shared/navigation'

defineProps<{
  company: CompanyCatalogItem
}>()
</script>

<template>
  <NuxtLink
    :to="ROUTES.COMPANY(company.slug)"
    class="group flex h-full flex-col overflow-hidden rounded-[28px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)] transition-transform duration-300 hover:-translate-y-1"
  >
    <div class="flex flex-1 flex-col p-6 sm:p-7">
      <h2 class="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
        {{ company.name }}
      </h2>

      <div class="mt-6 overflow-hidden rounded-[24px] bg-[#f1f1ec]">
        <img
          :src="company.coverImage || '/images/placeholder.svg'"
          :alt="company.name"
          class="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        >
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 border-t border-black/10 px-6 py-4">
      <p class="text-sm font-medium uppercase tracking-[0.12em] text-text/46">
        {{ company.type }}
      </p>

      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-text-on-accent transition-transform duration-300 group-hover:scale-110">
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 17 17 7M9 7h8v8"
          />
        </svg>
      </span>
    </div>
  </NuxtLink>
</template>
