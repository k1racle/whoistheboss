<script setup lang="ts">
import type { VideoInterviewItem } from '@features/videos/model/video.types'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'

const props = defineProps<{
  interview: VideoInterviewItem | null
}>()

const emit = defineEmits<{
  close: []
}>()

const dialog = useTemplateRef<HTMLElement>('dialog')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
let previouslyFocused: HTMLElement | null = null

const getFocusableElements = () => Array.from(dialog.value?.querySelectorAll<HTMLElement>(
  'button:not([disabled]), a[href], iframe, video[controls], [tabindex]:not([tabindex="-1"])',
) || [])

const onKeydown = (event: KeyboardEvent) => {
  if (!props.interview) return

  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab') return

  const focusable = getFocusableElements()
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(() => props.interview, async (interview, previous) => {
  if (interview && !previous) {
    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    await nextTick()
    closeButton.value?.focus()
  }
  else if (!interview && previous) {
    await nextTick()
    previouslyFocused?.focus()
    previouslyFocused = null
  }
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  previouslyFocused?.focus()
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="interview"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm sm:p-6 lg:p-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        @click.self="emit('close')"
      >
        <div ref="dialog" class="flex max-h-full w-full max-w-[1440px] flex-col bg-bg text-text">
          <div class="grid min-h-14 grid-cols-[minmax(0,1fr)_3.5rem] border-b border-text/20 bg-accent text-text-on-accent">
            <div class="min-w-0 px-4 py-3 sm:px-5">
              <p class="truncate font-sans text-xs uppercase leading-4 opacity-75 sm:text-sm">
                {{ interview.entrepreneur.name }}
              </p>
              <h2 id="video-modal-title" class="truncate font-sans text-sm font-bold uppercase leading-4 sm:text-base">
                {{ interview.title }}
              </h2>
            </div>
            <button
              ref="closeButton"
              type="button"
              class="flex min-h-14 items-center justify-center border-l border-white/30 font-sans text-2xl leading-none transition-colors duration-150 hover:bg-surface hover:text-accent focus-visible:bg-surface focus-visible:text-accent"
              aria-label="Закрыть видео"
              @click="emit('close')"
            >
              ×
            </button>
          </div>

          <VideoFrame
            :key="interview.id"
            :title="interview.title"
            :video-type="interview.videoType"
            :video-url="interview.videoUrl"
            :video-file="interview.videoFile"
            :poster="interview.coverImage"
            aspect-class="aspect-video"
            class="min-h-0 w-full border-0"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
