<script setup lang="ts">
import type { VideoInterviewItem } from '@features/videos/model/video.types'
import VideoInterviewCard from '@features/videos/ui/VideoInterviewCard.vue'
import VideoInterviewModal from '@features/videos/ui/VideoInterviewModal.vue'

const props = defineProps<{
  interviews: VideoInterviewItem[]
}>()

const route = useRoute()
const router = useRouter()
const activeSlug = computed(() => typeof route.query.play === 'string' ? route.query.play : '')
const activeInterview = computed(() =>
  props.interviews.find(interview => interview.slug === activeSlug.value) ?? null)

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

watch(activeInterview, (interview, previous) => {
  if (!import.meta.client) return

  if (interview && !previous) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  else if (!interview && previous) {
    document.body.style.overflow = previousBodyOverflow
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <section class="bg-bg text-text">
    <div class="mx-auto w-full max-w-[1920px] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-10 lg:pb-28 lg:pt-20">
      <div class="border-b border-text/20 pb-7 sm:pb-9">
        <p class="font-sans text-xs uppercase tracking-[0.12em] text-text-muted sm:text-sm">
          [ видеоархив медиагида ]
        </p>
        <h1 class="mt-5 font-display text-[clamp(5.5rem,17vw,20rem)] font-black uppercase leading-[0.72] tracking-[-0.04em] text-accent">
          Все видео
        </h1>
        <div class="mt-8 grid gap-5 border-t border-text/20 pt-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.6fr)]">
          <p class="max-w-[42rem] font-sans text-base leading-5 sm:text-lg sm:leading-6">
            Видеоинтервью с предпринимателями о бизнесе, решениях, командах и людях, которые создают проекты в России.
          </p>
          <p class="font-sans text-sm uppercase leading-4 text-text-muted sm:text-right">
            {{ interviews.length }} {{ interviews.length === 1 ? 'видео' : 'видео в коллекции' }}
          </p>
        </div>
      </div>

      <div v-if="interviews.length" class="mt-8 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:mt-12 xl:grid-cols-3">
        <VideoInterviewCard
          v-for="(interview, index) in interviews"
          :key="interview.id"
          :interview="interview"
          :index="index"
          :priority="index < 3"
          @play="openVideo(interview.slug)"
        />
      </div>

      <p v-else class="mt-10 border-y border-text/20 py-8 font-sans text-base uppercase leading-5 text-text-muted">
        Видео появятся после первой публикации.
      </p>
    </div>

    <VideoInterviewModal :interview="activeInterview" @close="closeVideo" />
  </section>
</template>
