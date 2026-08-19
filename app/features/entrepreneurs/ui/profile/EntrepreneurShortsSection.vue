<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import LandingSlider from '@features/landing/ui/slider/LandingSlider.vue'
import ReelModal from '@features/reels/ui/ReelModal.vue'
import EntrepreneurShortCard from './EntrepreneurShortCard.vue'

const props = defineProps<{
  reels: ReelItem[]
}>()

const activeReel = shallowRef<ReelItem | null>(null)

const visibleReels = computed<(ReelItem | null)[]>(() =>
  Array.from({ length: 3 }, (_, index) => props.reels[index] || null),
)

const openReel = (reel: ReelItem) => {
  activeReel.value = reel
}

const closeReel = () => {
  activeReel.value = null
}
</script>

<template>
  <section class="min-h-svh bg-bg px-10 py-12 md:flex md:items-center max-md:min-h-0 max-md:px-5 max-md:py-20">
    <LandingSlider
      class="mx-auto w-full max-w-[1920px]"
      :items-count="visibleReels.length"
      aria-label="Короткие видео героя"
      desktop-track-class="md:grid md:grid-cols-3 md:items-center md:gap-8"
    >
      <EntrepreneurShortCard
        v-for="(reel, index) in visibleReels"
        :key="reel?.id || `short-${index}`"
        :reel="reel"
        class="min-w-[78%] shrink-0 snap-center sm:min-w-[420px] md:min-w-0"
        @open="openReel"
      />
    </LandingSlider>

    <ReelModal :reel="activeReel" @close="closeReel" />
  </section>
</template>
