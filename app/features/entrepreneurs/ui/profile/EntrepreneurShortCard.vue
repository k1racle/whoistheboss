<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'

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
    class="relative flex aspect-[9/16] w-full cursor-pointer items-center justify-center overflow-hidden border-0 bg-surface/90 p-0"
    :aria-label="`Открыть рилс ${reel.title}`"
    @click="emit('open', reel)"
  >
    <NuxtImg v-if="reel.coverImage" :src="reel.coverImage" :alt="reel.title" class="h-full w-full object-cover" />
    <span class="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-current text-lg leading-none text-text-on-accent" aria-hidden="true">▶</span>
  </button>

  <div v-else class="relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden border border-text/10 bg-surface/90" aria-hidden="true">
    <span class="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-current text-lg leading-none text-text">▶</span>
  </div>
</template>
