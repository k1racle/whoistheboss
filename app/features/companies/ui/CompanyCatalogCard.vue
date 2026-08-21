<script setup lang="ts">
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'
import { ROUTES } from '@shared/navigation'

const props = defineProps<{
  company: CompanyCatalogItem
  priority?: boolean
}>()

const imageSrc = computed(() => props.company.coverImage || '/images/placeholder.svg')
</script>

<template>
  <NuxtLink
    :to="ROUTES.COMPANY(company.slug)"
    class="group relative grid aspect-square min-w-0 grid-rows-[minmax(0,1fr)_104px] bg-accent text-text-on-accent no-underline md:grid-rows-[minmax(0,1fr)_132px]"
    :aria-label="`${company.name}, ${company.type}`"
  >
    <h3 class="absolute left-0 top-0 z-[1] max-w-full overflow-hidden bg-accent px-[17px] py-2 font-sans text-[25px] font-normal uppercase leading-[27px] tracking-normal text-text-on-accent md:text-[32px] md:leading-8">
      {{ company.name }}
    </h3>

    <div class="relative m-[17px] mb-0 min-h-0 overflow-hidden bg-border-strong">
      <NuxtImg
        :src="imageSrc"
        :alt="company.name"
        sizes="320:100vw 480:100vw sm:100vw md:50vw xl:33vw 2000:614px"
        format="webp"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
      />
    </div>

    <div class="flex items-end justify-between gap-6 px-3 pb-4 pt-3.5 md:px-4 md:pb-5 md:pt-[18px]">
      <span class="inline-flex h-[46px] w-[82px] shrink-0" aria-hidden="true">
        <img src="/images/company-card-arrow.svg" alt="">
      </span>

      <p class="m-0 w-3/5 text-right font-sans text-[13px] font-normal uppercase leading-[13px] tracking-normal md:text-base md:leading-4">
        {{ company.type }}
      </p>
    </div>
  </NuxtLink>
</template>
