<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import MediaPlayBadge from '@shared/ui/media/MediaPlayBadge.vue'

defineProps<{
  reel: ReelItem
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
    :aria-label="`Смотреть Reels «${reel.title}»`"
    @click="emit('play')"
  >
    <span class="relative block aspect-[9/16] w-full overflow-hidden bg-surface-invert">
      <NuxtImg
        :src="reel.coverImage || '/images/placeholder.svg'"
        :alt="reel.title"
        sizes="320:100vw 480:100vw sm:50vw xl:25vw 2000:460px"
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
        Reels
      </span>
      <span class="mt-3 font-display text-[24px] font-black uppercase leading-none tracking-[-0.03em] sm:text-[28px] lg:text-[32px]">
        {{ reel.title }}
      </span>
    </span>
  </button>
</template>
