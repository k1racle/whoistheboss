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
  props.reels.find((reel) => reel.slug === activeSlug.value) ?? null
)

const setPageScrollLock = (locked: boolean) => {
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
  <section class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
      <div class="max-w-[50rem] space-y-4">
        <h1 class="font-display text-[clamp(3.5rem,9vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
          Коротко. Рилсы
        </h1>
        <p class="font-sans text-base leading-7 text-text-muted sm:text-lg">
          Быстрые истории и инсайты от предпринимателей в коротком видеоформате.
        </p>
      </div>

      <div
        v-if="reels.length"
        class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="reel in reels"
          :key="reel.id"
          class="group overflow-hidden border border-border-strong bg-surface"
        >
          <button
            type="button"
            class="group block w-full text-left"
            @click="openReel(reel.slug)"
          >
            <div class="relative aspect-[9/16] overflow-hidden bg-text">
              <img
                :src="reel.coverImage || reel.entrepreneur?.photo || '/images/placeholder.svg'"
                :alt="reel.entrepreneur?.name || reel.title"
                class="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.03]"
              >
              <div class="absolute inset-0 bg-linear-to-t from-text/60 via-transparent to-transparent" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-text shadow-[0_16px_38px_rgba(7,7,7,0.28)] transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-text-on-accent">
                  <span class="ml-1 text-3xl leading-none">▶</span>
                </div>
              </div>
            </div>

            <div class="space-y-2 p-5">
              <h2 class="font-display text-[clamp(2rem,5vw,3.2rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-text transition-colors group-hover:text-accent">
                {{ reel.title }}
              </h2>
              <p
                v-if="reel.entrepreneur?.name"
                class="font-sans text-sm uppercase leading-5 text-text-muted"
              >
                {{ reel.entrepreneur.name }}
              </p>
            </div>
          </button>
        </article>
      </div>

      <p
        v-else
        class="border border-border-strong bg-surface px-5 py-10 font-sans text-base leading-6 text-text-muted"
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
