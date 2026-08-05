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
    class="group relative block min-h-[380px] overflow-hidden border border-border-strong bg-surface transition-transform duration-300 hover:-translate-y-1 sm:min-h-[460px]"
  >
    <img
      :src="entrepreneur.photo || '/images/placeholder.svg'"
      :alt="entrepreneur.name"
      class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    >
    <img
      v-if="entrepreneur.hoverPhoto"
      :src="entrepreneur.hoverPhoto"
      alt=""
      class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    >

    <div class="absolute inset-0 bg-linear-to-t from-text via-text/25 to-transparent" />

    <div class="relative flex h-full flex-col justify-between p-5 sm:p-6">
      <div class="inline-flex items-center gap-3 self-start border border-white/30 bg-white/10 px-3 py-2 font-sans text-xs uppercase leading-4 text-text-on-accent backdrop-blur sm:text-sm">
        <span>{{ entrepreneur.title }}</span>
        <span aria-hidden="true">[ ↗ ]</span>
      </div>

      <div class="space-y-3">
        <h3 class="font-display text-[clamp(2rem,6vw,3.8rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-text-on-accent">
          {{ entrepreneur.name }}
        </h3>
        <p class="max-w-[18rem] font-sans text-sm leading-6 text-text-on-accent/86 sm:text-base">
          Перейти к полной истории героя
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
