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
const imageElement = useTemplateRef<HTMLImageElement>('imageElement')

watch(
  [() => props.desktopImage, () => props.mobileImage],
  () => {
    isImageLoaded.value = false
  },
)

onMounted(() => {
  const image = imageElement.value
  if (!image?.complete) return

  isImageLoaded.value = image.naturalWidth > 0
})
</script>

<template>
  <section class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
    <div class="mx-auto w-full max-w-[1920px]">
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
            :srcset="mobileImage"
          >
          <img
            ref="imageElement"
            :src="imageSource"
            alt=""
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            @load="isImageLoaded = true"
            @error="isImageLoaded = false"
          >
        </picture>
      </NuxtLink>
    </div>
  </section>
</template>
