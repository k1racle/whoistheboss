<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'

defineProps<{
  interviews: InterviewListItem[]
}>()
</script>

<template>
  <section id="interview-list" class="bg-bg py-24 max-md:px-5 max-md:py-[72px]">
    <div class="mx-auto w-[min(calc(100%_-_80px),1920px)] max-md:w-full">
      <h2 class="m-0 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-md:text-[clamp(48px,16vw,80px)] max-md:leading-[0.92]">
        Интервью
      </h2>
      <div class="mt-10 grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <NuxtLink
          v-for="item in interviews"
          :key="item.id"
          :to="`/interviews/${item.slug}`"
          class="bg-surface text-text no-underline"
        >
          <img :src="item.coverImage || '/images/placeholder.svg'" :alt="item.title" class="aspect-video w-full object-cover">
          <h3 class="m-0 p-5 font-sans text-[22px] font-bold uppercase leading-[22px]">
            {{ item.title }}
          </h3>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
