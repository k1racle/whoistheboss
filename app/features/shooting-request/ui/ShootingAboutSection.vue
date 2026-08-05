<script setup lang="ts">
import VideoFrame from '@shared/ui/media/VideoFrame.vue'

defineProps<{
  title: string
  text: string
  bottomText: string
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string
  videoFile: string
}>()
</script>

<template>
  <section class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <div class="grid gap-8 rounded-[32px] border border-black/10 bg-surface p-6 shadow-[0_24px_64px_rgba(7,7,7,0.06)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:p-8 xl:p-10">
        <div class="flex flex-col gap-6">
          <img
            src="/images/image-29.svg"
            alt="Кто здесь главный?"
            class="h-10 w-auto"
          >
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            {{ title }}
          </h2>
          <div class="space-y-4 text-base leading-7 text-text/78 sm:text-lg">
            <p
              v-for="paragraph in text.split(/\n\s*\n/).filter(Boolean)"
              :key="paragraph"
              class="whitespace-pre-line"
            >
              {{ paragraph }}
            </p>
          </div>
          <a
            href="#stages"
            class="inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold uppercase tracking-[0.14em] text-text-on-accent transition-colors hover:bg-[#b82600]"
          >
            Как это работает
          </a>
        </div>

        <div class="flex flex-col gap-6">
          <div class="overflow-hidden rounded-[28px] shadow-[0_20px_48px_rgba(7,7,7,0.12)]">
            <VideoFrame
              :title="title"
              :video-type="videoType"
              :video-url="videoUrl"
              :video-file="videoFile"
              aspect-class="aspect-video"
            />
          </div>
          <p class="text-sm leading-6 text-text/56 sm:text-base">
            {{ bottomText }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
