<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import MediaPlayBadge from '@shared/ui/media/MediaPlayBadge.vue'

defineProps<{
  reel: ReelItem | null
}>()

const emit = defineEmits<{
  open: [reel: ReelItem]
}>()
</script>

<template>
  <button
    v-if="reel"
    type="button"
    class="group relative flex aspect-[9/16] w-full cursor-pointer items-center justify-center overflow-hidden border-0 bg-surface/90 p-0"
    :aria-label="`Открыть рилс ${reel.title}`"
    @click="emit('open', reel)"
  >
    <NuxtImg
      v-if="reel.coverImage"
      :src="reel.coverImage"
      :alt="reel.title"
      sizes="320:78vw 480:78vw sm:420px md:33vw 2000:614px"
      format="webp"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-cover"
    />
    <MediaPlayBadge class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110" />
  </button>

  <div v-else class="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden border border-text/10 bg-surface/90" aria-hidden="true">
    <MediaPlayBadge class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
  </div>
</template>
