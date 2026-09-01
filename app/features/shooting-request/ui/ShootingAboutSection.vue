<script setup lang="ts">
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import { protectPrepositions } from '@shared/lib/typography'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'
import PlainTextWithBreaks from '@shared/ui/text/PlainTextWithBreaks.vue'

const props = defineProps<{
  title: string
  text: string
  bottomText: string
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  showBanner: boolean
}>()

const protectedText = computed(() => protectPrepositions(props.text))
const protectedTitle = computed(() => protectPrepositions(props.title))
const protectedBottomText = computed(() => protectPrepositions(props.bottomText))
const bannerImageSource = computed(() => props.bannerImage || props.bannerMobileImage)

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

      <div class="relative overflow-hidden border border-border-strong bg-surface">
        <NuxtLink
          v-if="showBanner && bannerImageSource"
          :to="bannerLink"
          class="group block w-full"
          aria-label="Открыть материал баннера"
        >
          <picture class="block w-full">
            <source v-if="bannerMobileImage" media="(max-width: 768px)" :srcset="bannerMobileImage">
            <NuxtImg
              :src="bannerImageSource"
              alt=""
              sizes="320:100vw 480:100vw sm:100vw lg:67vw 2000:1220px"
              format="webp"
              loading="lazy"
              decoding="async"
              class="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </picture>
        </NuxtLink>
        <div
          v-else
          role="img"
          aria-label="Баннер пока не добавлен"
          class="flex aspect-video w-full animate-pulse items-center justify-center bg-linear-to-br from-surface via-border/45 to-surface px-6"
        >
          <span class="h-2/3 w-2/3 rounded-sm bg-border-strong/45" aria-hidden="true" />
        </div>
      </div>
    </div>

    <p class="mx-auto mt-16 w-full max-w-[1920px] whitespace-pre-line font-display text-[clamp(3.5rem,9vw,10rem)] font-black uppercase leading-[0.8] tracking-[-0.04em] text-accent lg:mt-24">
      {{ protectedBottomText }}
    </p>
  </section>
</template>
