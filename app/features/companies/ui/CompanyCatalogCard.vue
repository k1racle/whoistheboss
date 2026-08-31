<script setup lang="ts">
import type { CompanyCatalogItem } from '@features/companies/model/companies-page.types'
import { ROUTES } from '@shared/navigation'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'

const props = defineProps<{
  company: CompanyCatalogItem
  priority?: boolean
}>()

const imageSrc = computed(() => props.company.coverImage || '/images/placeholder.svg')
</script>

<template>
  <NuxtLink
    :to="ROUTES.COMPANY(company.slug)"
    class="group relative grid aspect-square min-w-0 grid-rows-[minmax(0,1fr)_23.2%] bg-accent text-text-on-accent no-underline"
    :aria-label="`${company.name}, ${company.type}`"
  >
    <h3 class="absolute left-0 top-0 z-[1] max-w-full overflow-hidden text-ellipsis whitespace-nowrap bg-accent px-[clamp(8px,0.9vw,17px)] py-[clamp(4px,0.45vw,8px)] font-sans text-[clamp(16px,2vw,32px)] font-normal uppercase leading-none tracking-normal text-text-on-accent">
      {{ company.name }}
    </h3>

    <div class="relative m-[clamp(8px,0.9vw,17px)] mb-0 min-h-0 overflow-hidden bg-border-strong">
      <NuxtImg
        :src="imageSrc"
        :alt="company.name"
        sizes="320:70vw 480:70vw sm:70vw md:33vw 2000:614px"
        format="webp"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] group-focus-visible:scale-[1.025]"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
      />
    </div>

    <div class="flex items-end justify-between gap-[clamp(8px,1.25vw,24px)] px-[clamp(8px,0.9vw,16px)] pb-[clamp(10px,1.1vw,20px)] pt-[clamp(8px,1vw,18px)]">
      <span class="inline-flex h-[clamp(27px,2.25vw,46px)] w-[clamp(48px,4vw,82px)] shrink-0" aria-hidden="true">
        <ArrowMark class="size-full" />
      </span>

      <p class="m-0 w-3/5 text-right font-sans text-[clamp(11px,1vw,16px)] font-normal uppercase leading-none tracking-normal">
        {{ company.type }}
      </p>
    </div>
  </NuxtLink>
</template>
