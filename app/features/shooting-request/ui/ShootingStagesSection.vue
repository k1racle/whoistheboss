<script setup lang="ts">
import type { ShootingStageItem } from '@features/shooting-request/model/shooting-page.types'

defineProps<{
  title: string
  stages: ShootingStageItem[]
}>()
</script>

<template>
  <section
    id="stages"
    class="bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <div class="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
        <h2 class="font-display text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          {{ title }}
        </h2>
        <p class="max-w-[36rem] text-base leading-7 text-text/72 sm:text-lg">
          Процесс разбит на понятные этапы: от первого знакомства до публикации готового материала.
        </p>
      </div>

      <div class="grid gap-6">
        <article
          v-for="stage in stages"
          :key="`${stage.index}-${stage.title}`"
          class="grid overflow-hidden rounded-[30px] border border-black/10 shadow-[0_24px_64px_rgba(7,7,7,0.06)] lg:grid-cols-[260px_minmax(0,1fr)]"
        >
          <div class="bg-text p-6 text-text-on-accent sm:p-7">
            <span class="text-sm font-medium uppercase tracking-[0.16em] text-text-on-accent/50">
              [ {{ stage.index }} ]
            </span>
            <h3 class="mt-6 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
              {{ stage.title }}
            </h3>
            <p class="mt-3 text-sm font-medium uppercase tracking-[0.12em] text-text-on-accent/70">
              {{ stage.subtitle }}
            </p>
          </div>

          <div class="bg-[#f7f7f4] p-6 sm:p-7">
            <p class="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              {{ stage.eyebrow }}
            </p>
            <p class="mt-4 text-base leading-7 text-text/76 sm:text-lg">
              {{ stage.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
