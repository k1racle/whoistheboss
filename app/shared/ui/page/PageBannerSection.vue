<script setup lang="ts">
import { DEFAULT_IMAGE_QUALITY, isOptimizableUploadImage } from '@shared/image/image-variants'
import BannerSkeleton from '@shared/ui/skeleton/BannerSkeleton.vue'

const DESKTOP_IMAGE_WIDTHS = [640, 960, 1280, 1600, 1920, 2560, 3200, 3840] as const
const MOBILE_IMAGE_WIDTHS = [480, 640, 768, 960, 1280, 1600] as const

const props = withDefaults(defineProps<{
  desktopImage?: string
  mobileImage?: string
  href?: string
}>(), {
  desktopImage: '',
  mobileImage: '',
  href: '/',
})

const imageSource = computed(() => props.desktopImage || props.mobileImage)
const isImageLoaded = shallowRef(false)
const image = useImage()

function imageUrl(src: string, width: number) {
  return image(src, { width, quality: DEFAULT_IMAGE_QUALITY, format: 'webp' })
}

function imageSrcset(src: string, widths: readonly number[]) {
  if (!src) return undefined
  if (!isOptimizableUploadImage(src)) return src

  return widths
    .map(width => `${imageUrl(src, width)} ${width}w`)
    .join(', ')
}

const desktopImageSrc = computed(() => imageSource.value
  ? imageUrl(imageSource.value, 1920)
  : '')
const desktopImageSrcset = computed(() => imageSrcset(imageSource.value, DESKTOP_IMAGE_WIDTHS))
const mobileImageSrcset = computed(() => imageSrcset(props.mobileImage, MOBILE_IMAGE_WIDTHS))

watch(
  [() => props.desktopImage, () => props.mobileImage],
  () => {
    isImageLoaded.value = false
  },
)

</script>

<template>
  <section class="bg-bg py-12 lg:py-16">
    <div class="w-full max-w-none">
      <NuxtLink
        :to="href"
        class="group grid overflow-hidden border border-border-strong bg-surface"
        aria-label="Открыть материал баннера"
      >
        <BannerSkeleton
          v-if="!isImageLoaded"
          class="col-start-1 row-start-1"
        />

        <picture
          v-if="imageSource"
          class="col-start-1 row-start-1 transition-opacity duration-300"
          :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
        >
          <source
            v-if="mobileImage"
            media="(max-width: 768px)"
            :srcset="mobileImageSrcset"
            sizes="100vw"
          >
          <img
            :src="desktopImageSrc || imageSource"
            :srcset="desktopImageSrcset"
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            @load="isImageLoaded = true"
            @error="isImageLoaded = false"
          >
        </picture>
      </NuxtLink>
    </div>
  </section>
</template>
