<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import ReelModal from '@features/reels/ui/ReelModal.vue'

const props = defineProps<{
  reels: ReelItem[]
}>()

const route = useRoute()
const router = useRouter()
const activeSlug = computed(() => typeof route.query.play === 'string' ? route.query.play : '')

const activeReel = computed(() =>
  props.reels.find((reel) => reel.slug === activeSlug.value) ?? null,
)

const setPageScrollLock = (locked: boolean) => {
  if (!import.meta.client) {
    return
  }

  document.body.style.overflow = locked ? 'hidden' : ''
}

const openReel = async (slug: string) => {
  await router.replace({
    query: {
      ...route.query,
      play: slug,
    },
  })
}

const closeReel = async () => {
  const nextQuery = { ...route.query }
  delete nextQuery.play
  await router.replace({ query: nextQuery })
}

watch(activeReel, (reel) => {
  setPageScrollLock(Boolean(reel))
}, { immediate: true })

onBeforeUnmount(() => {
  setPageScrollLock(false)
})
</script>

<template>
  <section class="bg-bg px-5 py-16 text-text lg:px-10 lg:py-24">
    <div class="mx-auto w-full max-w-[1920px]">
      <h1 class="font-display text-[clamp(64px,12vw,180px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent">
        Рилсы
      </h1>

      <div v-if="reels.length" class="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="(reel, index) in reels"
          :key="reel.id"
          type="button"
          class="group relative aspect-[9/16] overflow-hidden bg-surface text-left text-text"
          @click="openReel(reel.slug)"
        >
          <NuxtImg
            :src="reel.coverImage || '/images/placeholder.svg'"
            :alt="reel.title"
            sizes="320:100vw 480:100vw sm:50vw xl:25vw 2000:460px"
            format="webp"
            :loading="index < 4 ? 'eager' : 'lazy'"
            :fetchpriority="index < 4 ? 'high' : 'auto'"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
          <span class="absolute inset-x-0 bottom-0 bg-text/80 p-4 font-sans text-base font-bold uppercase leading-5 text-white">
            {{ reel.title }}
          </span>
        </button>
      </div>

      <p v-else class="mt-14 font-sans text-sm uppercase tracking-[0.14em] text-text/55">
        Рилсы появятся после первой публикации
      </p>
    </div>

    <ReelModal
      v-if="activeReel"
      :reel="activeReel"
      @close="closeReel"
    />
  </section>
</template>
