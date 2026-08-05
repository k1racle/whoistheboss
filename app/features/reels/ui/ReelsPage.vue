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
  <section class="bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-12">
      <div class="max-w-3xl">
        <h1 class="text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
          Коротко. Рилсы
        </h1>
        <p class="mt-4 text-xl leading-relaxed text-text/68">
          Быстрые истории и инсайты от предпринимателей.
        </p>
      </div>

      <div
        v-if="reels.length"
        class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="reel in reels"
          :key="reel.id"
          class="group overflow-hidden rounded-[28px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)] transition-transform duration-300 hover:-translate-y-1"
        >
          <button
            type="button"
            class="block w-full text-left"
            @click="openReel(reel.slug)"
          >
            <div class="relative aspect-[9/16] overflow-hidden bg-[#111]">
              <img
                :src="reel.coverImage || reel.entrepreneur?.photo || '/images/placeholder.svg'"
                :alt="reel.entrepreneur?.name || reel.title"
                class="h-full w-full object-cover opacity-90 blur-[2px] transition-transform duration-500 group-hover:scale-105"
              >
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-accent shadow-[0_16px_36px_rgba(7,7,7,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                  <svg
                    class="ml-1 h-7 w-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="p-6">
              <h2 class="text-lg font-bold leading-tight text-text transition-colors group-hover:text-accent">
                {{ reel.title }}
              </h2>
              <p
                v-if="reel.entrepreneur?.name"
                class="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-text/42"
              >
                {{ reel.entrepreneur.name }}
              </p>
            </div>
          </button>
        </article>
      </div>

      <p
        v-else
        class="rounded-[28px] border border-black/10 bg-[#f7f7f4] px-6 py-10 text-base leading-7 text-text/54"
      >
        Пока нет опубликованных рилсов.
      </p>
    </div>

    <ReelModal
      :reel="activeReel"
      @close="closeReel"
    />
  </section>
</template>
