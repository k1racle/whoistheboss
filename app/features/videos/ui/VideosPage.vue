<script setup lang="ts">
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import type { ReelItem } from '@features/reels/model/reel.types'
import ReelModal from '@features/reels/ui/ReelModal.vue'
import type { EntrepreneurVideoItem } from '@features/videos/model/video.types'
import VideoInterviewCard from '@features/videos/ui/VideoInterviewCard.vue'
import VideoInterviewModal from '@features/videos/ui/VideoInterviewModal.vue'
import VideoReelCard from '@features/videos/ui/VideoReelCard.vue'

const props = defineProps<{
  videos: EntrepreneurVideoItem[]
  reels: ReelItem[]
}>()

type MediaView = 'videos' | 'reels'

const route = useRoute()
const router = useRouter()
const activeView = computed<MediaView>(() => route.query.view === 'reels' ? 'reels' : 'videos')
const activeSlug = computed(() => typeof route.query.play === 'string' ? route.query.play : '')
const activeVideo = computed(() =>
  activeView.value === 'videos'
    ? props.videos.find(video => video.slug === activeSlug.value) ?? null
    : null)
const activeReel = computed(() =>
  activeView.value === 'reels'
    ? props.reels.find(reel => reel.slug === activeSlug.value) ?? null
    : null)
const activeMedia = computed(() => activeVideo.value || activeReel.value)

let previousBodyOverflow = ''

const setView = async (view: MediaView) => {
  const nextQuery = { ...route.query }
  delete nextQuery.play

  if (view === 'reels') nextQuery.view = 'reels'
  else delete nextQuery.view

  await router.replace({ query: nextQuery })
}

const openVideo = async (slug: string) => {
  await router.replace({
    query: {
      ...route.query,
      play: slug,
    },
  })
}

const closeVideo = async () => {
  const nextQuery = { ...route.query }
  delete nextQuery.play
  await router.replace({ query: nextQuery })
}

watch(activeMedia, (media, previous) => {
  if (!import.meta.client) return

  if (media && !previous) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  else if (!media && previous) {
    document.body.style.overflow = previousBodyOverflow
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <main class="bg-bg text-text">
    <LandingHeroSection title="Все видео" />

    <section class="mx-auto w-full max-w-[1920px] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-10 lg:pb-28 lg:pt-20">
      <div class="mb-8 grid grid-cols-2 border border-text/20 sm:mb-12" aria-label="Формат видео">
        <button
          type="button"
          class="min-h-14 cursor-pointer px-4 py-3 font-display text-2xl font-black uppercase leading-none transition-colors duration-200 sm:min-h-16 sm:text-4xl"
          :class="activeView === 'videos' ? 'bg-accent text-text-on-accent' : 'bg-bg text-text hover:bg-surface focus-visible:bg-surface'"
          :aria-pressed="activeView === 'videos'"
          @click="setView('videos')"
        >
          Видео
        </button>
        <button
          type="button"
          class="min-h-14 cursor-pointer border-l border-text/20 px-4 py-3 font-display text-2xl font-black uppercase leading-none transition-colors duration-200 sm:min-h-16 sm:text-4xl"
          :class="activeView === 'reels' ? 'bg-accent text-text-on-accent' : 'bg-bg text-text hover:bg-surface focus-visible:bg-surface'"
          :aria-pressed="activeView === 'reels'"
          @click="setView('reels')"
        >
          Reels
        </button>
      </div>

      <div v-if="activeView === 'videos' && videos.length" class="grid gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
        <VideoInterviewCard
          v-for="(video, index) in videos"
          :key="video.id"
          :video="video"
          :priority="index < 3"
          @play="openVideo(video.slug)"
        />
      </div>

      <div v-else-if="activeView === 'reels' && reels.length" class="grid gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        <VideoReelCard
          v-for="(reel, index) in reels"
          :key="reel.id"
          :reel="reel"
          :priority="index < 4"
          @play="openVideo(reel.slug)"
        />
      </div>

      <p v-else class="border-y border-text/20 py-8 font-sans text-base uppercase leading-5 text-text-muted">
        <template v-if="activeView === 'videos'">
        Видео появятся после добавления интервью на страницах предпринимателей.
        </template>
        <template v-else>
          Reels появятся после первой публикации.
        </template>
      </p>
    </section>

    <VideoInterviewModal :video="activeVideo" @close="closeVideo" />
    <ReelModal :reel="activeReel" @close="closeVideo" />
  </main>
</template>
