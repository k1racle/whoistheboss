<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'

defineProps<{
  reel: ReelItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

watch(
  () => !!defineModel,
  () => {},
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="reel"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-text/82 px-4 py-6 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="flex w-full max-w-[460px] flex-col gap-4">
        <button
          type="button"
          class="self-end font-sans text-sm uppercase leading-4 text-text-on-accent transition-colors hover:text-white/70"
          @click="emit('close')"
        >
          Закрыть
        </button>

        <div class="overflow-hidden border border-white/20 bg-surface">
          <VideoFrame
            :title="reel.title"
            :video-type="reel.videoType"
            :video-url="reel.videoUrl"
            :video-file="reel.videoFile"
            aspect-class="aspect-[9/16]"
          />
        </div>

        <div class="border border-white/20 bg-text/18 p-4 text-text-on-accent">
          <h3 class="font-display text-[clamp(2rem,6vw,3rem)] font-black uppercase leading-[0.94] tracking-[-0.03em]">
            {{ reel.title }}
          </h3>
          <p
            v-if="reel.entrepreneur?.name"
            class="mt-2 font-sans text-sm uppercase leading-5 text-text-on-accent/78"
          >
            {{ reel.entrepreneur.name }}<span v-if="reel.entrepreneur.title"> · {{ reel.entrepreneur.title }}</span>
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
