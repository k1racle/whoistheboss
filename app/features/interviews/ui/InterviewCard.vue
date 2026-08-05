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
    class="group overflow-hidden rounded-[28px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)] transition-transform duration-300 hover:-translate-y-1 sm:flex"
  >
    <div class="h-64 overflow-hidden bg-[#f1f1ec] sm:h-auto sm:w-56 md:w-60">
      <img
        :src="interview.entrepreneur?.photo || interview.coverImage || '/images/placeholder.svg'"
        :alt="interview.entrepreneur?.name || interview.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      >
    </div>

    <div class="flex flex-1 flex-col justify-center p-6 sm:p-8">
      <h2 class="text-2xl font-bold leading-tight tracking-tight text-text transition-colors group-hover:text-accent">
        {{ interview.entrepreneur?.name || interview.title }}
      </h2>
      <p
        v-if="interview.entrepreneur?.title"
        class="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-text/42"
      >
        {{ interview.entrepreneur.title }}
      </p>
      <p
        v-if="interview.quote || interview.entrepreneur?.quote"
        class="mt-5 text-lg leading-8 text-text/72 italic"
      >
        «{{ interview.quote || interview.entrepreneur?.quote }}»
      </p>

      <div class="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-accent">
        <svg
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Смотреть интервью</span>
      </div>
    </div>
  </NuxtLink>
</template>
