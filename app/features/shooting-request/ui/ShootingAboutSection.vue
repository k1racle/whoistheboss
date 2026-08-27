<script setup lang="ts">
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import { protectPrepositions } from '@shared/lib/typography'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'
import PlainTextWithBreaks from '@shared/ui/text/PlainTextWithBreaks.vue'

const props = defineProps<{
  title: string
  text: string
  bottomText: string
  videoType: 'EMBED' | 'SELF_HOSTED'
  videoUrl: string
  videoFile: string
}>()

const protectedText = computed(() => protectPrepositions(props.text))
const protectedTitle = computed(() => protectPrepositions(props.title))
const protectedBottomText = computed(() => protectPrepositions(props.bottomText))

</script>

<template>
  <section id="about" class="relative bg-bg px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
    <div class="mx-auto grid w-full max-w-[1920px] gap-10 lg:grid-cols-[1fr_2fr] lg:gap-12">
      <div class="flex flex-col justify-end gap-8">
        <div>
          <SectionTitle>
            {{ protectedTitle }}
          </SectionTitle>
          <div class="mt-6 font-sans text-base leading-4 text-text/78">
            <p><PlainTextWithBreaks :text="protectedText" /></p>
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

    <p class="mx-auto mt-16 w-full max-w-[1920px] whitespace-pre-line font-display text-[clamp(3.5rem,9vw,10rem)] font-black uppercase leading-[0.8] tracking-[-0.04em] text-accent lg:mt-24">
      {{ protectedBottomText }}
    </p>
  </section>
</template>
