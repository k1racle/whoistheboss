<script setup lang="ts">
import { getDisplayNameSize } from '@shared/lib/typography'

const props = defineProps<{
  ownerName: string
  ownerTitle: string
  ownerQuote: string | null
  ownerHeroRightTeaser: string | null
  ownerHeroBottomRightTeaser: string | null
  photo: string | null
}>()

const nameParts = computed(() => props.ownerName.trim().split(/\s+/).filter(Boolean))
const givenName = computed(() => nameParts.value[0] || props.ownerName)
const familyName = computed(() => nameParts.value.slice(1).join(' '))
const topText = computed(() => props.ownerHeroRightTeaser || props.ownerQuote || props.ownerTitle)
const bottomText = computed(() => props.ownerHeroBottomRightTeaser || props.ownerTitle)
const displayNameSize = computed(() => getDisplayNameSize(props.ownerName))
</script>

<template>
  <section class="relative min-h-svh bg-bg px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
    <div class="mx-auto w-full max-w-[1920px]">
      <div class="mx-auto aspect-[0.78] w-[min(78vw,520px)] overflow-hidden bg-border-strong lg:w-[min(560px,34vw)]">
        <NuxtImg
          v-if="photo"
          :src="photo"
          :alt="ownerName"
          sizes="320:78vw 480:78vw sm:520px lg:34vw 2000:560px"
          format="webp"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover"
        />
      </div>

      <div class="relative mt-11 flex min-w-0 flex-col">
        <p class="m-0 mb-4 whitespace-pre-line font-sans text-[13px] font-bold uppercase leading-[14px] text-text lg:absolute lg:left-0 lg:top-[18%] lg:mb-0 lg:w-[min(500px,27%)] lg:text-right lg:text-base lg:leading-4 [overflow-wrap:anywhere]">
          {{ topText }}
        </p>
        <h2
          class="company-founder-name m-0 flex min-w-0 flex-col whitespace-nowrap font-display font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent lg:leading-none"
          :class="displayNameSize"
        >
          <span class="order-2 lg:order-1 lg:self-end">{{ givenName }}</span>
          <span v-if="familyName" class="order-1 lg:order-2 lg:-mt-[clamp(24px,3vw,58px)] lg:self-start">{{ familyName }}</span>
        </h2>
        <p class="m-0 mt-4 whitespace-pre-line font-sans text-[13px] font-bold uppercase leading-[14px] text-text lg:absolute lg:bottom-[18%] lg:right-0 lg:mt-0 lg:w-[min(500px,27%)] lg:text-left lg:text-base lg:leading-4 [overflow-wrap:anywhere]">
          {{ bottomText }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (max-width: 1023px) {
  .company-founder-name {
    font-size: clamp(72px, 20vw, 160px);
  }
}
</style>
