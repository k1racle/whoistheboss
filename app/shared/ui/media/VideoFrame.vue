<script setup lang="ts">
import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '@shared/lib/media-url'
interface Props {
  title: string
  videoType?: 'EMBED' | 'SELF_HOSTED' | null
  videoUrl?: string | null
  videoFile?: string | null
  aspectClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  videoType: 'EMBED',
  videoUrl: '',
  videoFile: '',
  aspectClass: 'aspect-video',
})

const safeVideoUrl = computed(() => getTrustedEmbedUrl(props.videoUrl))
const safeVideoFile = computed(() => getSafeUploadedMediaUrl(props.videoFile))
</script>

<template>
  <div
    class="overflow-hidden border border-border-strong bg-surface"
    :class="aspectClass"
  >
    <iframe
      v-if="videoType === 'EMBED' && safeVideoUrl"
      :src="safeVideoUrl"
      :title="title"
      class="h-full w-full"
      allow="autoplay; fullscreen"
      allowfullscreen
      sandbox="allow-scripts allow-same-origin allow-presentation"
      referrerpolicy="strict-origin-when-cross-origin"
      loading="lazy"
      frameborder="0"
    />

    <video
      v-else-if="safeVideoFile"
      :src="safeVideoFile"
      :title="title"
      class="h-full w-full object-cover"
      controls
      playsinline
      preload="metadata"
    />

    <div
      v-else
      class="flex h-full w-full items-center justify-center px-6 text-center font-sans text-sm leading-6 text-text-muted sm:text-base"
    >
      Видео пока не добавлено.
    </div>
  </div>
</template>
