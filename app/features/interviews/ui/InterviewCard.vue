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
    class="group flex min-h-full flex-col bg-surface text-text no-underline transition-colors duration-200 hover:bg-accent hover:text-text-on-accent focus-visible:bg-accent focus-visible:text-text-on-accent"
  >
    <NuxtImg
      :src="interview.coverImage || '/images/placeholder.svg'"
      :alt="interview.title"
      sizes="320:100vw 480:100vw sm:100vw md:50vw xl:33vw 2000:614px"
      format="webp"
      loading="lazy"
      decoding="async"
      class="aspect-[4/3] w-full object-cover"
    />
    <div class="flex flex-1 flex-col gap-3 p-5">
      <span v-if="interview.entrepreneur" class="font-sans text-sm uppercase leading-4">
        {{ interview.entrepreneur.name }}
      </span>
      <h2 class="font-sans text-[27px] font-bold uppercase leading-[27px] tracking-[-1.25px] md:text-[32px] md:leading-8">
        {{ interview.title }}
      </h2>
      <p v-if="interview.subtitle" class="mt-auto font-sans text-base leading-5">
        {{ interview.subtitle }}
      </p>
    </div>
  </NuxtLink>
</template>
