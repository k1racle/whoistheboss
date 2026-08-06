<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import InterviewCard from '@features/interviews/ui/InterviewCard.vue'

defineProps<{
  interviews: InterviewListItem[]
}>()
</script>

<template>
  <section class="bg-bg px-5 py-16 text-text lg:px-10 lg:py-24">
    <div class="mx-auto w-full max-w-[1920px]">
      <h1 class="font-display text-[clamp(64px,12vw,180px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent">
        Интервью
      </h1>

      <div v-if="interviews.length" class="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <InterviewCard
          v-for="interview in interviews"
          :key="interview.id"
          :interview="interview"
        />
      </div>

      <p v-else class="mt-14 font-sans text-sm uppercase tracking-[0.14em] text-text/55">
        Интервью появятся после первой публикации
      </p>
    </div>
  </section>
</template>
