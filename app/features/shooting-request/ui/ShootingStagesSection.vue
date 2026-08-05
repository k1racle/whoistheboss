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
    class="border-y border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
  >
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 class="font-display text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          {{ title }}
        </h2>
        <p class="max-w-[34rem] font-sans text-sm leading-6 text-text-muted sm:text-base">
          Процесс разбит на понятные этапы: от первого знакомства до публикации готового материала.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="stage in stages"
          :key="`${stage.index}-${stage.title}`"
          class="flex h-full flex-col justify-between border border-border-strong bg-bg p-5 sm:p-6"
        >
          <div class="flex flex-col gap-5">
            <span class="font-sans text-xs uppercase leading-4 tracking-[0.18em] text-accent">
              [ {{ stage.index }} ]
            </span>
            <div class="space-y-2">
              <h3 class="font-display text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-text">
                {{ stage.title }}
              </h3>
              <p class="font-sans text-sm uppercase leading-5 text-text-muted">
                {{ stage.subtitle }}
              </p>
            </div>
          </div>

          <div class="mt-8 space-y-4">
            <p class="font-sans text-xs uppercase leading-4 tracking-[0.16em] text-text-muted">
              {{ stage.eyebrow }}
            </p>
            <p class="font-sans text-sm leading-6 text-text/80 sm:text-base">
              {{ stage.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
