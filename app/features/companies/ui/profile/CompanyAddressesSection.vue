<script setup lang="ts">
import type { MapCoordinates } from '@shared/types/map'
import YandexMap from '@shared/ui/map/YandexMap.vue'

defineProps<{
  name: string
  mapCoordinates: MapCoordinates[]
}>()
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto w-full max-w-[1920px]">
      <h2 class="m-0 text-center font-display text-[clamp(96px,24vw,200px)] font-black uppercase leading-none tracking-[-0.03em] text-text lg:text-[320px] lg:leading-[320px]">
        АДРЕСА
      </h2>

      <div class="relative mt-14 min-h-[58svh] overflow-hidden bg-surface">
        <YandexMap
          v-if="mapCoordinates.length"
          :coordinates="mapCoordinates"
          :title="`Адреса ${name}`"
          class="absolute inset-0 h-full w-full border-0 grayscale saturate-150 contrast-105"
        />
      </div>
    </div>
  </section>
</template>
