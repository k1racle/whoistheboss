<script setup lang="ts">
import BannerSkeleton from '@shared/ui/skeleton/BannerSkeleton.vue'

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
const desktopImageSrc = computed(() => imageSource.value
  ? image(imageSource.value, { width: 1920, quality: 76, format: 'webp' })
  : '')
const mobileImageSrcset = computed(() => {
  if (!props.mobileImage) return undefined

  return [
    `${image(props.mobileImage, { width: 768, quality: 78, format: 'webp' })} 768w`,
    `${image(props.mobileImage, { width: 1536, quality: 78, format: 'webp' })} 1536w`,
  ].join(', ')
})

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
          <NuxtImg
            :src="desktopImageSrc || imageSource"
            alt=""
            sizes="320:100vw 768:100vw lg:100vw 2000:1920px"
            format="webp"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            @load="isImageLoaded = true"
            @error="isImageLoaded = false"
          />
        </picture>
      </NuxtLink>
    </div>
  </section>
</template>
