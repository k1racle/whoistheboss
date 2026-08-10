<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { protectPrepositions } from '@shared/lib/typography'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import SiteLogo from '@shared/ui/logo/SiteLogo.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  text: string
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string
  videoFile: string
  hoverVideoType: 'EMBED' | 'SELF_HOSTED'
  hoverVideoUrl: string
  hoverVideoFile: string
}>()

const logoRef = ref<HTMLElement | null>(null)
const isMediaHovered = shallowRef(false)
const fallbackImageFailed = shallowRef(false)

defineExpose({ logoRef })

const paragraphs = computed(() => props.text.split(/\n{2,}/).filter(Boolean))
const protectedTitle = computed(() => protectPrepositions(props.title))
const fallbackImageSrc = '/uploads/frame-118-1784803179906.png'

interface AboutMedia {
  type: 'EMBED' | 'SELF_HOSTED'
  source: string
}

function resolveMedia(
  type: AboutMedia['type'],
  url: string,
  file: string,
): AboutMedia | null {
  const source = type === 'SELF_HOSTED' ? file || url : url || file

  return source ? { type, source } : null
}

const defaultMedia = computed(() => resolveMedia(
  props.videoType,
  props.videoUrl,
  props.videoFile,
))

const hoverMedia = computed(() => resolveMedia(
  props.hoverVideoType,
  props.hoverVideoUrl,
  props.hoverVideoFile,
))

const activeMedia = computed(() => (
  isMediaHovered.value ? hoverMedia.value ?? defaultMedia.value : defaultMedia.value
))

function showHoverMedia() {
  isMediaHovered.value = true
}

function showDefaultMedia() {
  isMediaHovered.value = false
}

function hideBrokenFallback() {
  fallbackImageFailed.value = true
}
</script>

<template>
  <section
    id="landing-about-section"
    class="relative bg-bg"
  >
    <span
      ref="logoRef"
      class="absolute left-4 top-4 sm:left-6 sm:top-6 lg:left-10 lg:top-16 hidden xl:block"
    >
      <SiteLogo />
    </span>
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:gap-12 lg:px-10 lg:py-16">
      <div class="flex flex-col justify-end gap-8 lg:w-1/3">
        <div class="space-y-6">

          <div class="space-y-5">
            <SectionTitle>
              {{ protectedTitle }}
            </SectionTitle>
            <div class="space-y-4 font-sans text-base leading-4 text-text/78">
              <p
                v-for="paragraph in paragraphs"
                :key="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>

        <ButtonLink
          :to="ROUTES.SHOOTING_REQUEST"
          class="w-fit"
        >
          Стать героем
        </ButtonLink>
      </div>

      <div
        class="relative aspect-video overflow-hidden border border-border-strong bg-surface lg:w-2/3"
        @mouseenter="showHoverMedia"
        @mouseleave="showDefaultMedia"
      >
        <iframe
          v-if="activeMedia?.type === 'EMBED'"
          :key="activeMedia.source"
          :src="activeMedia.source"
          title="О проекте"
          class="h-full w-full border-0"
          allow="autoplay; fullscreen"
          allowfullscreen
          loading="lazy"
        />
        <video
          v-else-if="activeMedia"
          :key="activeMedia.source"
          :src="activeMedia.source"
          title="О проекте"
          class="h-full w-full object-cover"
          controls
          muted
          playsinline
          preload="metadata"
        />
        <NuxtImg
          v-else-if="!fallbackImageFailed"
          :src="fallbackImageSrc"
          alt="Превью видео проекта Кто здесь главный?"
          class="h-full w-full object-cover"
          @error="hideBrokenFallback"
        />
        <div
          v-else
          role="img"
          aria-label="Видео пока не добавлено"
          class="flex h-full w-full animate-pulse items-center justify-center bg-linear-to-br from-surface via-border/45 to-surface px-6"
        >
          <span class="h-2/3 w-2/3 rounded-sm bg-border-strong/45" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>
</template>
