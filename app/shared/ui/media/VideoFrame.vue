<script setup lang="ts">
interface Props {
  title: string
  videoType?: 'EMBED' | 'SELF_HOSTED' | null
  videoUrl?: string | null
  videoFile?: string | null
  aspectClass?: string
}

withDefaults(defineProps<Props>(), {
  videoType: 'EMBED',
  videoUrl: '',
  videoFile: '',
  aspectClass: 'aspect-video',
})
</script>

<template>
  <div
    class="overflow-hidden border border-border-strong bg-surface"
    :class="aspectClass"
  >
    <iframe
      v-if="videoType === 'EMBED' && videoUrl"
      :src="videoUrl"
      :title="title"
      class="h-full w-full"
      allow="autoplay; fullscreen"
      allowfullscreen
      loading="lazy"
      frameborder="0"
    />

    <video
      v-else-if="videoFile"
      :src="videoFile"
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
