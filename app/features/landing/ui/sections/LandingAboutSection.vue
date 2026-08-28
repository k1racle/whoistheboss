<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { protectPrepositions } from '@shared/lib/typography'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'
import PlainTextWithBreaks from '@shared/ui/text/PlainTextWithBreaks.vue'
import { getSafeUploadedMediaUrl, getTrustedEmbedUrl } from '@shared/lib/media-url'

const props = defineProps<{
  title: string
  text: string
  coverImage: string
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string
  videoFile: string
}>()

const isVideoActive = shallowRef(false)
const coverImageFailed = shallowRef(false)

const protectedText = computed(() => protectPrepositions(props.text))
const protectedTitle = computed(() => protectPrepositions(props.title))
const coverImageSrc = computed(() => props.coverImage || '/images/placeholder.svg')

interface AboutMedia {
  type: 'EMBED' | 'SELF_HOSTED'
  source: string
}

function resolveMedia(
  type: AboutMedia['type'],
  url: string,
  file: string,
): AboutMedia | null {
  const source = type === 'SELF_HOSTED'
    ? getSafeUploadedMediaUrl(file || url)
    : getTrustedEmbedUrl(url || file)

  return source ? { type, source } : null
}

const videoMedia = computed(() => resolveMedia(
  props.videoType,
  props.videoUrl,
  props.videoFile,
))

function showVideo() {
  if (videoMedia.value) isVideoActive.value = true
}

function showCover() {
  isVideoActive.value = false
}

function hideBrokenCover() {
  coverImageFailed.value = true
}

watch(() => props.coverImage, () => {
  coverImageFailed.value = false
})
</script>

<template>
  <section
    id="landing-about-section"
    class="relative bg-bg"
  >
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:gap-12 lg:px-10 lg:py-16">
      <div class="flex flex-col justify-end gap-8 lg:w-1/3">
        <div class="space-y-6">

          <div class="space-y-5">
            <SectionTitle>
              {{ protectedTitle }}
            </SectionTitle>
            <div class="font-sans text-base leading-4 text-text/78">
              <p>
                <PlainTextWithBreaks :text="protectedText" />
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
        @mouseenter="showVideo"
        @mouseleave="showCover"
      >
        <iframe
          v-if="isVideoActive && videoMedia?.type === 'EMBED'"
          :key="videoMedia.source"
          :src="videoMedia.source"
          title="О проекте"
          class="h-full w-full border-0"
          allow="autoplay; fullscreen"
          allowfullscreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerpolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
        <video
          v-else-if="isVideoActive && videoMedia"
          :key="videoMedia.source"
          :src="videoMedia.source"
          title="О проекте"
          class="h-full w-full object-cover"
          controls
          muted
          autoplay
          loop
          playsinline
          preload="metadata"
        />
        <NuxtImg
          v-else-if="!coverImageFailed"
          :src="coverImageSrc"
          alt="Обложка видео проекта Маршрут Построен"
          sizes="320:100vw 480:100vw sm:100vw lg:67vw 2000:1220px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover"
          @error="hideBrokenCover"
        />
        <div
          v-else
          role="img"
          aria-label="Обложка пока не добавлена"
          class="flex h-full w-full animate-pulse items-center justify-center bg-linear-to-br from-surface via-border/45 to-surface px-6"
        >
          <span class="h-2/3 w-2/3 rounded-sm bg-border-strong/45" aria-hidden="true" />
        </div>
        <button
          v-if="!isVideoActive && videoMedia"
          type="button"
          class="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
          aria-label="Показать видео о проекте"
          @click="showVideo"
        />
      </div>
    </div>
  </section>
</template>
