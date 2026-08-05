<script setup lang="ts">
import type { InterviewDetailResponse } from '@features/interviews/model/interview.types'
import { formatRussianDate } from '@shared/lib/date'
import { ROUTES } from '@shared/navigation'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'

defineProps<InterviewDetailResponse>()
</script>

<template>
  <div class="flex flex-col">
    <article class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div class="mx-auto flex w-full max-w-[1100px] flex-col gap-8">
        <NuxtLink
          :to="ROUTES.INTERVIEWS"
          class="font-sans text-sm uppercase leading-4 text-accent transition-colors hover:text-text sm:text-base"
        >
          ← Все интервью
        </NuxtLink>

        <header class="space-y-5">
          <h1 class="font-display text-[clamp(3rem,9vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
            {{ interview.title }}
          </h1>

          <p
            v-if="interview.subtitle"
            class="max-w-[48rem] font-sans text-lg leading-8 text-text/82 sm:text-xl"
          >
            {{ interview.subtitle }}
          </p>

          <div class="flex flex-wrap gap-x-4 gap-y-2 font-sans text-sm uppercase leading-5 text-text-muted sm:text-base">
            <NuxtLink
              v-if="interview.entrepreneur"
              :to="ROUTES.ENTREPRENEUR(interview.entrepreneur.slug)"
              class="text-text transition-colors hover:text-accent"
            >
              {{ interview.entrepreneur.name }}
            </NuxtLink>
            <span v-if="interview.entrepreneur?.title">{{ interview.entrepreneur.title }}</span>
            <span v-if="interview.publishedAt">{{ formatRussianDate(interview.publishedAt) }}</span>
          </div>
        </header>

        <VideoFrame
          :title="interview.title"
          :video-type="interview.videoType"
          :video-url="interview.videoUrl"
          :video-file="interview.videoFile"
          aspect-class="aspect-video"
        />

        <blockquote
          v-if="interview.quote"
          class="border-l-4 border-accent pl-5 font-sans text-xl leading-8 text-text sm:text-2xl"
        >
          «{{ interview.quote }}»
        </blockquote>

        <p
          v-if="interview.summary"
          class="max-w-[52rem] font-sans text-lg leading-8 text-text/84"
        >
          {{ interview.summary }}
        </p>

        <TrustedRichText
          v-if="interview.content"
          :html="interview.content"
          class="max-w-none font-sans text-base leading-8 text-text/84
            [&_a]:text-accent [&_a]:underline-offset-4
            [&_a:hover]:underline
            [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-5
            [&_blockquote]:text-xl [&_blockquote]:leading-8
            [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[clamp(2rem,6vw,4rem)] [&_h2]:font-black [&_h2]:uppercase [&_h2]:leading-[0.92] [&_h2]:tracking-[-0.03em]
            [&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-[clamp(1.75rem,4vw,3rem)] [&_h3]:font-black [&_h3]:uppercase [&_h3]:leading-[0.94]
            [&_img]:my-8 [&_img]:w-full [&_img]:border [&_img]:border-border-strong
            [&_li]:mb-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:text-text [&_ul]:my-6 [&_ul]:pl-6"
        />
      </div>
    </article>

    <section
      v-if="related.length"
      class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
    >
      <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
        <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          Еще интервью
        </h2>

        <div class="grid gap-5 xl:grid-cols-3">
          <NuxtLink
            v-for="item in related"
            :key="item.id"
            :to="ROUTES.INTERVIEW(item.slug)"
            class="group overflow-hidden border border-border-strong bg-bg transition-transform duration-300 hover:-translate-y-1"
          >
            <div class="aspect-video overflow-hidden">
              <img
                :src="item.coverImage || item.entrepreneur?.photo || '/images/placeholder.svg'"
                :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              >
            </div>
            <div class="space-y-2 p-5">
              <h3 class="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-text transition-colors group-hover:text-accent">
                {{ item.entrepreneur?.name || item.title }}
              </h3>
              <p
                v-if="item.entrepreneur?.title"
                class="font-sans text-sm uppercase leading-5 text-text-muted"
              >
                {{ item.entrepreneur.title }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
