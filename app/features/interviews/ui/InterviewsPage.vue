<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import InterviewCard from '@features/interviews/ui/InterviewCard.vue'

defineProps<{
  interviews: InterviewListItem[]
}>()
</script>

<template>
  <section class="bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-12">
      <div class="max-w-3xl">
        <h1 class="text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
          Разговоры с основателями
        </h1>
        <p class="mt-4 text-xl leading-relaxed text-text/68">
          Разговоры с основателями бизнеса о решениях, команде и лидерстве.
        </p>
      </div>

      <div
        v-if="interviews.length"
        class="grid grid-cols-1 gap-8 lg:grid-cols-2"
      >
        <InterviewCard
          v-for="interview in interviews"
          :key="interview.id"
          :interview="interview"
        />
      </div>

      <p
        v-else
        class="rounded-[28px] border border-black/10 bg-[#f7f7f4] px-6 py-10 text-base leading-7 text-text/54"
      >
        Пока нет опубликованных интервью.
      </p>
    </div>
  </section>
</template>
