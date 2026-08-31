<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'

const props = defineProps<{
  reel: ReelItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.reel) {
    emit('close')
  }
}

onMounted(() => {
  if (!import.meta.client) {
    return
  }

  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="reel"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/72 px-4 py-6 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="flex w-full max-w-[420px] flex-col gap-4">
        <button
          type="button"
          class="self-end text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-white/70"
          @click="emit('close')"
        >
          Закрыть
        </button>

        <div class="overflow-hidden rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.28)]">
          <VideoFrame
            :title="reel.title"
            :video-type="reel.videoType"
            :video-url="reel.videoUrl"
            :video-file="reel.videoFile"
            :poster="reel.coverImage"
            aspect-class="aspect-[9/16]"
          />
        </div>

        <div class="rounded-[24px] bg-surface p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          <h3 class="text-2xl font-bold leading-tight tracking-tight text-text">
            {{ reel.title }}
          </h3>
          <p
            v-if="reel.entrepreneur?.name"
            class="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-text/44"
          >
            {{ reel.entrepreneur.name }}<span v-if="reel.entrepreneur.title"> • {{ reel.entrepreneur.title }}</span>
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
