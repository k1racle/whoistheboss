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
  <div class="flex flex-col">
    <article class="bg-surface px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
      <div class="mx-auto flex w-full max-w-4xl flex-col">
        <NuxtLink
          :to="ROUTES.INTERVIEWS"
          class="text-sm font-semibold text-accent transition-colors hover:underline"
        >
          ← Все интервью
        </NuxtLink>

        <header class="mt-6">
          <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-text sm:text-5xl lg:text-6xl">
            {{ interview.title }}
          </h1>

          <p
            v-if="interview.subtitle"
            class="mt-5 text-xl leading-relaxed text-text/68 sm:text-2xl"
          >
            {{ interview.subtitle }}
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-text/46">
            <NuxtLink
              v-if="interview.entrepreneur"
              :to="ROUTES.ENTREPRENEUR(interview.entrepreneur.slug)"
              class="font-semibold text-text transition-colors hover:text-accent"
            >
              {{ interview.entrepreneur.name }}
            </NuxtLink>
            <span v-if="interview.entrepreneur?.title">•</span>
            <span v-if="interview.entrepreneur?.title">{{ interview.entrepreneur.title }}</span>
            <span v-if="interview.publishedAt">•</span>
            <span v-if="interview.publishedAt">{{ formatRussianDate(interview.publishedAt) }}</span>
          </div>
        </header>

        <div
          v-if="hasVideo"
          class="mt-12 overflow-hidden rounded-[32px] shadow-[0_28px_80px_rgba(7,7,7,0.16)]"
        >
          <VideoFrame
            :title="interview.title"
            :video-type="interview.videoType"
            :video-url="interview.videoUrl"
            :video-file="interview.videoFile"
            aspect-class="aspect-video"
          />
        </div>

        <blockquote
          v-if="interview.quote"
          class="mt-12 border-l-4 border-accent pl-6 text-2xl leading-snug text-text italic sm:text-3xl"
        >
          «{{ interview.quote }}»
        </blockquote>

        <p
          v-if="interview.summary"
          class="mt-10 text-xl leading-relaxed text-text/76"
        >
          {{ interview.summary }}
        </p>

        <TrustedRichText
          v-if="interview.content"
          :html="interview.content"
          class="mt-10 max-w-none text-lg leading-8 text-text/82
            [&_a]:text-accent [&_a]:underline-offset-4
            [&_a:hover]:underline
            [&_blockquote]:my-10 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6
            [&_blockquote]:text-2xl [&_blockquote]:leading-snug [&_blockquote]:italic
            [&_h2]:mt-14 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight
            [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:tracking-tight
            [&_iframe]:aspect-video [&_iframe]:w-full
            [&_img]:my-10 [&_img]:w-full [&_img]:rounded-[28px]
            [&_li]:mb-3 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:font-semibold [&_ul]:my-6 [&_ul]:pl-6"
        />
      </div>
    </article>

    <section
      v-if="related.length"
      class="border-t border-black/10 bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <h2 class="text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
          Ещё интервью
        </h2>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <NuxtLink
            v-for="item in related"
            :key="item.id"
            :to="ROUTES.INTERVIEW(item.slug)"
            class="group overflow-hidden rounded-[26px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)] transition-transform duration-300 hover:-translate-y-1"
          >
            <div class="aspect-video overflow-hidden bg-[#f1f1ec]">
              <img
                :src="item.coverImage || item.entrepreneur?.photo || '/images/placeholder.svg'"
                :alt="item.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              >
            </div>

            <div class="p-6">
              <h3 class="text-xl font-bold leading-tight tracking-tight text-text transition-colors group-hover:text-accent">
                {{ item.entrepreneur?.name || item.title }}
              </h3>
              <p
                v-if="item.entrepreneur?.title"
                class="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-text/42"
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
