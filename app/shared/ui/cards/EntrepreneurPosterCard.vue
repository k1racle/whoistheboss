<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

defineProps<{
  entrepreneur: {
    slug: string
    name: string
    title: string
    photo: string | null
    hoverPhoto?: string | null
  }
}>()
</script>

<template>
  <NuxtLink
    :to="ROUTES.ENTREPRENEUR(entrepreneur.slug)"
    class="group relative block min-h-[420px] overflow-hidden rounded-[30px] border border-black/10 bg-text shadow-[0_26px_72px_rgba(7,7,7,0.18)] transition-transform duration-300 hover:-translate-y-1 sm:min-h-[500px]"
  >
    <NuxtImg
      :src="entrepreneur.photo || '/images/placeholder.svg'"
      :alt="entrepreneur.name"
      sizes="320:100vw 480:100vw sm:100vw md:50vw xl:33vw 2000:614px"
      format="webp"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
    />
    <NuxtImg
      v-if="entrepreneur.hoverPhoto"
      :src="entrepreneur.hoverPhoto"
      alt=""
      sizes="320:100vw 480:100vw sm:100vw md:50vw xl:33vw 2000:614px"
      format="webp"
      loading="lazy"
      decoding="async"
      class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    />

    <div class="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/90" />

    <div class="relative flex h-full flex-col justify-between p-6 sm:p-7">
      <div class="flex items-start justify-between gap-4">
        <span class="max-w-[14rem] rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-white backdrop-blur">
          {{ entrepreneur.title }}
        </span>

        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:scale-110">
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

      <div>
        <h3 class="font-display text-[clamp(2.4rem,6vw,4.4rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text-on-accent">
          {{ entrepreneur.name }}
        </h3>
        <p class="mt-3 max-w-[18rem] text-sm leading-6 text-white/78 sm:text-base">
          Перейти к полной истории героя
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
