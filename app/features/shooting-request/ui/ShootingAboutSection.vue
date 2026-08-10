<script setup lang="ts">
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import { protectPrepositions } from '@shared/lib/typography'
import SiteLogo from '@shared/ui/logo/SiteLogo.vue'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  text: string
  bottomText: string
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string
  videoFile: string
}>()

const logoRef = ref<HTMLElement | null>(null)
const paragraphs = computed(() => props.text.split(/\n{2,}/).filter(Boolean))
const protectedTitle = computed(() => protectPrepositions(props.title))

defineExpose({ logoRef })
</script>

<template>
  <section id="about" class="relative bg-bg px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
    <span ref="logoRef" class="absolute left-10 top-16 hidden xl:block">
      <SiteLogo />
    </span>

    <div class="mx-auto grid w-full max-w-[1920px] gap-10 lg:grid-cols-[1fr_2fr] lg:gap-12">
      <div class="flex flex-col justify-end gap-8">
        <div>
          <SectionTitle>
            {{ protectedTitle }}
          </SectionTitle>
          <div class="mt-6 space-y-4 font-sans text-base leading-4 text-text/78">
            <p v-for="paragraph in paragraphs" :key="paragraph">{{ paragraph }}</p>
          </div>
        </div>

        <ButtonLink
          to="#stages"
          class="w-fit"
        >
          Как это работает
        </ButtonLink>
      </div>

      <VideoFrame
        :title="title"
        :video-type="videoType"
        :video-url="videoUrl"
        :video-file="videoFile"
        aspect-class="aspect-video"
      />
    </div>

    <p class="mx-auto mt-16 w-full max-w-[1920px] font-display text-[clamp(3.5rem,9vw,10rem)] font-black uppercase leading-[0.8] tracking-[-0.04em] text-accent lg:mt-24">
      {{ bottomText }}
    </p>
  </section>
</template>
