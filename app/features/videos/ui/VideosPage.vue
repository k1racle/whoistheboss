<script setup lang="ts">
import LandingHeroSection from '@features/landing/ui/sections/LandingHeroSection.vue'
import type { EntrepreneurVideoItem } from '@features/videos/model/video.types'
import VideoInterviewCard from '@features/videos/ui/VideoInterviewCard.vue'
import VideoInterviewModal from '@features/videos/ui/VideoInterviewModal.vue'

const props = defineProps<{
  videos: EntrepreneurVideoItem[]
}>()

const route = useRoute()
const router = useRouter()
const activeSlug = computed(() => typeof route.query.play === 'string' ? route.query.play : '')
const activeVideo = computed(() =>
  props.videos.find(video => video.slug === activeSlug.value) ?? null)

let previousBodyOverflow = ''

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

watch(activeVideo, (video, previous) => {
  if (!import.meta.client) return

  if (video && !previous) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  else if (!video && previous) {
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
      <div class="grid gap-5 border-y border-text/20 py-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.6fr)]">
        <p class="max-w-[42rem] font-sans text-base leading-5 sm:text-lg sm:leading-6">
          Видеоинтервью с предпринимателями о бизнесе, решениях, командах и людях, которые создают проекты в России.
        </p>
        <p class="font-sans text-sm uppercase leading-4 text-text-muted sm:text-right">
          {{ videos.length }} {{ videos.length === 1 ? 'видео' : 'видео в коллекции' }}
        </p>
      </div>

      <div v-if="videos.length" class="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:mt-12 xl:grid-cols-3">
        <VideoInterviewCard
          v-for="(video, index) in videos"
          :key="video.id"
          :video="video"
          :index="index"
          :priority="index < 3"
          @play="openVideo(video.slug)"
        />
      </div>

      <p v-else class="mt-10 border-y border-text/20 py-8 font-sans text-base uppercase leading-5 text-text-muted">
        Видео появятся после добавления интервью на страницах предпринимателей.
      </p>
    </section>

    <VideoInterviewModal :video="activeVideo" @close="closeVideo" />
  </main>
</template>
