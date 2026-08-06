<script setup lang="ts">
import VideoFrame from '@shared/ui/media/VideoFrame.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

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
      <SectionTitle class="mb-[70px] mt-0 max-lg:mb-10">
        СМОТРЕТЬ<br>ИНТЕРВЬЮ
      </SectionTitle>
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
