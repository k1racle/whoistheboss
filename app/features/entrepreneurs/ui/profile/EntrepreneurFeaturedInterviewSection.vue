<script setup lang="ts">
import VideoFrame from '@shared/ui/media/VideoFrame.vue'

defineProps<{
  name: string
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string | null
  videoFile: string | null
}>()
</script>

<template>
  <section id="interviews" class="min-h-svh bg-bg py-[130px] max-lg:min-h-0 max-lg:px-5 max-lg:py-20">
    <div class="mx-auto flex min-h-[calc(100svh-260px)] w-[min(calc(100%_-_80px),1920px)] flex-col max-lg:min-h-0 max-lg:w-full">
      <h2 class="mb-[70px] mt-0 font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-text max-lg:mb-10 max-lg:text-[clamp(43px,10vw,74px)] max-lg:leading-[0.92]">
        СМОТРЕТЬ<br>ИНТЕРВЬЮ
      </h2>
      <VideoFrame
        class="flex-1"
        :title="`Интервью — ${name}`"
        :video-type="videoType"
        :video-url="videoUrl"
        :video-file="videoFile"
        aspect-class="h-full min-h-[22rem]"
      />
    </div>
  </section>
</template>
