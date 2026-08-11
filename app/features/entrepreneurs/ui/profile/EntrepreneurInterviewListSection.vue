<script setup lang="ts">
import type { InterviewListItem } from '@features/interviews/model/interview.types'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

defineProps<{
  interviews: InterviewListItem[]
}>()
</script>

<template>
  <section id="interview-list" class="bg-bg py-24 max-md:px-5 max-md:py-[72px]">
    <div class="mx-auto w-[min(calc(100%_-_80px),1920px)] max-md:w-full">
      <SectionTitle class="m-0">
        Интервью
      </SectionTitle>
      <div class="mt-10 grid grid-cols-3 gap-5 max-md:grid-cols-1">
        <NuxtLink
          v-for="item in interviews"
          :key="item.id"
          :to="`/interviews/${item.slug}`"
          class="bg-surface text-text no-underline"
        >
          <NuxtImg
            :src="item.coverImage || '/images/placeholder.svg'"
            :alt="item.title"
            sizes="320:100vw 480:100vw sm:100vw md:33vw 2000:614px"
            format="webp"
            loading="lazy"
            decoding="async"
            class="aspect-video w-full object-cover"
          />
          <h3 class="m-0 p-5 font-sans text-[22px] font-bold uppercase leading-[22px]">
            {{ item.title }}
          </h3>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
