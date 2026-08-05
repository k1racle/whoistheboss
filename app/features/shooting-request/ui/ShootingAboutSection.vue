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
  <section class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
      <div class="flex flex-col gap-6">
        <img
          src="/images/image-29.svg"
          alt="Кто здесь главный?"
          class="h-10 w-auto"
        >
        <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          {{ title }}
        </h2>
        <div class="space-y-4 font-sans text-base leading-7 text-text/80 sm:text-lg">
          <p
            v-for="paragraph in text.split(/\\n\\s*\\n/).filter(Boolean)"
            :key="paragraph"
            class="whitespace-pre-line"
          >
            {{ paragraph }}
          </p>
        </div>
        <a
          href="#stages"
          class="inline-flex min-h-12 w-fit items-center justify-center bg-accent px-5 py-3 font-sans text-base uppercase leading-4 text-text-on-accent transition-colors hover:bg-surface-invert"
        >
          Как это работает
        </a>
      </div>

      <div class="flex flex-col gap-6">
        <VideoFrame
          :title="title"
          :video-type="videoType"
          :video-url="videoUrl"
          :video-file="videoFile"
          aspect-class="aspect-video"
        />
        <p class="font-sans text-sm leading-6 text-text-muted sm:text-base">
          {{ bottomText }}
        </p>
      </div>
    </div>
  </section>
</template>
