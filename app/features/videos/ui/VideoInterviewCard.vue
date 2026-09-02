<script setup lang="ts">
import type { EntrepreneurVideoItem } from '@features/videos/model/video.types'
import MediaPlayBadge from '@shared/ui/media/MediaPlayBadge.vue'

defineProps<{
  video: EntrepreneurVideoItem
  priority?: boolean
}>()

const emit = defineEmits<{
  play: []
}>()
</script>

<template>
  <button
    type="button"
    class="group flex min-h-full w-full cursor-pointer flex-col text-left text-text"
    :aria-label="`Смотреть интервью с ${video.name}`"
    @click="emit('play')"
  >
    <span class="relative block aspect-video w-full overflow-hidden bg-surface-invert">
      <NuxtImg
        :src="video.coverImage || '/images/placeholder.svg'"
        :alt="video.name"
        sizes="320:100vw 480:100vw sm:50vw xl:33vw 2000:614px"
        format="webp"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
        class="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025] motion-reduce:transition-none"
      />
      <span class="absolute inset-0 bg-black/10 transition-colors duration-200 group-hover:bg-black/25 group-focus-visible:bg-black/25" aria-hidden="true" />
      <MediaPlayBadge class="absolute left-1/2 top-1/2 !size-16 -translate-x-1/2 -translate-y-1/2 !shadow-none group-hover:scale-110 group-focus-visible:scale-110 sm:!size-20" />
    </span>

    <span class="flex flex-1 flex-col border border-t-0 border-text/20 bg-surface p-4 transition-colors duration-200 group-hover:bg-accent group-hover:text-text-on-accent group-focus-visible:bg-accent group-focus-visible:text-text-on-accent sm:p-5">
      <span class="font-sans text-xs uppercase leading-4 opacity-60 sm:text-sm">
        Смотреть интервью
      </span>
      <span class="mt-3 font-display text-[clamp(32px,6vw,50px)] font-black uppercase leading-[0.88] tracking-[-0.03em]">
        {{ video.name }}
      </span>
      <span class="mt-4 line-clamp-3 font-sans text-sm leading-5 opacity-75 sm:text-base sm:leading-6">
        {{ video.description }}
      </span>
    </span>
  </button>
</template>
