<script setup lang="ts">
import type { InterviewDetailResponse } from '@features/interviews/model/interview.types'
import { formatRussianDate } from '@shared/lib/date'
import { ROUTES } from '@shared/navigation'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'

const props = defineProps<InterviewDetailResponse>()

const hasVideo = computed(() => Boolean(props.interview.videoUrl || props.interview.videoFile))
</script>

<template>
  <article class="bg-bg px-5 py-16 text-text lg:px-10 lg:py-24">
    <div class="mx-auto w-full max-w-[1920px]">
      <NuxtLink :to="ROUTES.INTERVIEWS" class="font-sans text-sm uppercase leading-4 text-text/60 hover:text-accent">
        Интервью
      </NuxtLink>

      <h1 class="mt-8 font-display text-[clamp(56px,10vw,160px)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-accent">
        {{ interview.title }}
      </h1>

      <p v-if="interview.publishedAt" class="mt-6 font-sans text-sm uppercase leading-4 text-text/60">
        {{ formatRussianDate(interview.publishedAt) }}
      </p>

      <VideoFrame
        v-if="hasVideo"
        class="mt-12"
        :title="interview.title"
        :video-type="interview.videoType"
        :video-url="interview.videoUrl"
        :video-file="interview.videoFile"
        aspect-class="aspect-video"
      />

      <TrustedRichText
        v-if="interview.content"
        class="mt-12 max-w-[920px]"
        :html="interview.content"
      />
    </div>
  </article>
</template>
