<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import InterviewCard from '@features/interviews/ui/InterviewCard.vue'

defineProps<{
  interviews: InterviewListItem[]
}>()
</script>

<template>
  <section class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
      <div class="max-w-[52rem] space-y-4">
        <h1 class="font-display text-[clamp(3.5rem,9vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          Интервью
        </h1>
        <p class="font-sans text-base leading-7 text-text-muted sm:text-lg">
          Разговоры с основателями и руководителями о решениях, команде и лидерстве.
        </p>
      </div>

      <div
        v-if="interviews.length"
        class="grid gap-5"
      >
        <InterviewCard
          v-for="interview in interviews"
          :key="interview.id"
          :interview="interview"
        />
      </div>

      <p
        v-else
        class="border border-border-strong bg-surface px-5 py-10 font-sans text-base leading-6 text-text-muted"
      >
        Пока нет опубликованных интервью.
      </p>
    </div>
  </section>
</template>
