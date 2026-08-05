<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import { ROUTES } from '@shared/navigation'

defineProps<{
  interview: InterviewListItem
}>()
</script>

<template>
  <NuxtLink
    :to="ROUTES.INTERVIEW(interview.slug)"
    class="group grid overflow-hidden border border-border-strong bg-surface transition-transform duration-300 hover:-translate-y-1 lg:grid-cols-[240px_minmax(0,1fr)]"
  >
    <div class="relative min-h-[260px] overflow-hidden bg-bg">
      <img
        :src="interview.entrepreneur?.photo || interview.coverImage || '/images/placeholder.svg'"
        :alt="interview.entrepreneur?.name || interview.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      >
    </div>

    <div class="flex flex-col justify-between gap-6 p-5 sm:p-6">
      <div class="space-y-3">
        <h2 class="font-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-text transition-colors group-hover:text-accent">
          {{ interview.entrepreneur?.name || interview.title }}
        </h2>
        <p
          v-if="interview.entrepreneur?.title"
          class="font-sans text-sm uppercase leading-5 text-text-muted sm:text-base"
        >
          {{ interview.entrepreneur.title }}
        </p>
        <p
          v-if="interview.quote || interview.entrepreneur?.quote"
          class="max-w-[46rem] font-sans text-base leading-7 text-text/80 sm:text-lg"
        >
          «{{ interview.quote || interview.entrepreneur?.quote }}»
        </p>
      </div>

      <div class="inline-flex items-center gap-3 font-sans text-sm uppercase leading-4 text-accent sm:text-base">
        <span>Смотреть интервью</span>
        <span aria-hidden="true">[ ↗ ]</span>
      </div>
    </div>
  </NuxtLink>
</template>
