<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { protectPrepositions } from '@shared/lib/typography'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'
import PlainTextWithBreaks from '@shared/ui/text/PlainTextWithBreaks.vue'

const props = defineProps<{
  title: string
  text: string
  bannerImage: string
  bannerMobileImage: string
  bannerLink: string
  showBanner: boolean
}>()

const protectedText = computed(() => protectPrepositions(props.text))
const protectedTitle = computed(() => protectPrepositions(props.title))
const bannerImageSource = computed(() => props.bannerImage || props.bannerMobileImage)
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

      <div class="relative aspect-video overflow-hidden border border-border-strong bg-surface lg:w-2/3">
        <NuxtLink
          v-if="showBanner && bannerImageSource"
          :to="bannerLink"
          class="group block h-full w-full"
          aria-label="Открыть материал баннера"
        >
          <picture class="block h-full w-full">
            <source v-if="bannerMobileImage" media="(max-width: 768px)" :srcset="bannerMobileImage">
            <NuxtImg
              :src="bannerImageSource"
              alt=""
              sizes="320:100vw 480:100vw sm:100vw lg:67vw 2000:1220px"
              format="webp"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </picture>
        </NuxtLink>
        <div
          v-else
          role="img"
          aria-label="Баннер пока не добавлен"
          class="flex h-full w-full animate-pulse items-center justify-center bg-linear-to-br from-surface via-border/45 to-surface px-6"
        >
          <span class="h-2/3 w-2/3 rounded-sm bg-border-strong/45" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>
</template>
