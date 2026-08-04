<script setup lang="ts">
import type { LandingPlaceCard } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

defineProps<{
  item: LandingPlaceCard
  asSlide?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="ROUTES.COMPANY(item.slug)"
    class="group relative flex h-[400px] flex-col bg-accent p-4 text-text-on-accent transition-colors duration-300 hover:bg-[#b52200]"
    :class="asSlide ? 'min-w-[85%] shrink-0 snap-center' : ''"
    :aria-label="`${item.name}, ${item.type}`"
  >
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-lg font-bold uppercase tracking-wide">
        {{ item.name }} [ {{ item.type }} ]
      </h3>
    </div>

    <div class="relative flex-1 overflow-hidden bg-white/90">
      <NuxtImg
        v-if="item.coverImage"
        :src="item.coverImage"
        :alt="item.name"
        class="h-full w-full object-cover"
        densities="x1 x2"
      />

      <div
        class="absolute inset-0 flex items-center justify-center bg-accent/90 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <p
          v-if="item.description"
          class="text-center text-sm font-medium uppercase leading-tight"
        >
          {{ item.description }}
        </p>
      </div>
    </div>

    <div class="mt-4 flex items-end justify-between">
      <span class="text-2xl font-light">[ ↗ ]</span>
      <span
        v-if="item.description"
        class="max-w-[150px] text-right text-[10px] uppercase"
      >
        {{ item.description }}
      </span>
    </div>
  </NuxtLink>
</template>
