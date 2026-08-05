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
  
</template>
