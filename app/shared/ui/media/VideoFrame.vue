<script setup lang="ts">
import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '@shared/lib/media-url'
import MediaPlayBadge from '@shared/ui/media/MediaPlayBadge.vue'

interface Props {
  title: string
  videoType?: 'EMBED' | 'SELF_HOSTED' | null
  videoUrl?: string | null
  videoFile?: string | null
  poster?: string | null
  aspectClass?: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  videoType: 'EMBED',
  videoUrl: '',
  videoFile: '',
  poster: '',
  aspectClass: 'aspect-video',
  autoplay: false,
})

const safeVideoUrl = computed(() => getTrustedEmbedUrl(props.videoUrl))
const safeVideoFile = computed(() => getSafeUploadedMediaUrl(props.videoFile))
const videoElement = useTemplateRef<HTMLVideoElement>('videoElement')
const hasStarted = shallowRef(props.autoplay)
const hasPlayableMedia = computed(() => Boolean(
  (props.videoType === 'EMBED' && safeVideoUrl.value)
  || safeVideoFile.value,
))
const embedPlaybackUrl = computed(() => {
  if (!safeVideoUrl.value || !hasStarted.value) return safeVideoUrl.value

  const url = new URL(safeVideoUrl.value)
  url.searchParams.set('autoplay', '1')
  return url.toString()
})

const startPlayback = async () => {
  hasStarted.value = true
  if (props.videoType !== 'SELF_HOSTED') return

  try {
    await videoElement.value?.play()
  }
  catch {
    hasStarted.value = false
  }
}

watch(
  () => [props.videoType, props.videoUrl, props.videoFile, props.autoplay],
  () => {
    hasStarted.value = props.autoplay

    if (props.autoplay && props.videoType === 'SELF_HOSTED') {
      nextTick(() => startPlayback())
    }
  },
)

onMounted(() => {
  if (props.autoplay && props.videoType === 'SELF_HOSTED') {
    startPlayback()
  }
})
</script>

<template>
  <div
    class="relative overflow-hidden border border-border-strong bg-surface"
    :class="aspectClass"
  >
    <iframe
      v-if="videoType === 'EMBED' && safeVideoUrl"
      :src="embedPlaybackUrl"
      :title="title"
      class="h-full w-full"
      allow="autoplay; fullscreen"
      allowfullscreen
      sandbox="allow-scripts allow-same-origin allow-presentation"
      referrerpolicy="strict-origin-when-cross-origin"
      :loading="autoplay ? 'eager' : 'lazy'"
      frameborder="0"
    />

    <video
      v-else-if="safeVideoFile"
      ref="videoElement"
      :src="safeVideoFile"
      :poster="poster || undefined"
      :title="title"
      class="h-full w-full object-cover"
      controls
      :autoplay="autoplay"
      playsinline
      preload="metadata"
      @play="hasStarted = true"
    />

    <img
      v-if="poster && hasPlayableMedia && !hasStarted"
      :src="poster"
      :alt="`Обложка видео: ${title}`"
      class="absolute inset-0 z-[5] h-full w-full object-cover"
      loading="eager"
    >

    <div
      v-else-if="!hasPlayableMedia"
      class="flex h-full w-full items-center justify-center px-6 text-center font-sans text-sm leading-6 text-text-muted sm:text-base"
    >
      Видео пока не добавлено.
    </div>

    <button
      v-if="hasPlayableMedia && !hasStarted"
      type="button"
      class="absolute inset-0 z-10 flex cursor-pointer items-center justify-center border-0 bg-transparent p-0"
      :aria-label="`Воспроизвести: ${title}`"
      @click="startPlayback"
    >
      <MediaPlayBadge class="size-16 hover:scale-110 sm:size-20" />
    </button>
  </div>
</template>
