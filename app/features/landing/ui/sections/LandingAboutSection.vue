<script setup lang="ts">
import { landingAboutParagraphs } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'
import ArrowText from '@shared/ui/icons/ArrowText.vue'
import SiteLogo from '@shared/ui/logo/SiteLogo.vue'

const logoRef = ref<HTMLElement | null>(null)

defineExpose({ logoRef })
</script>

<template>
  <section
    id="landing-about-section"
    class="relative bg-bg"
  >
    <span
      ref="logoRef"
      class="absolute left-4 top-4 sm:left-6 sm:top-6 lg:left-10 lg:top-16 hidden sm:block"
    >
      <SiteLogo />
    </span>
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:gap-12 lg:px-10 lg:py-16">
      <div class="flex flex-col justify-end gap-8 lg:w-1/3">
        <div class="space-y-6">

          <div class="space-y-5">
            <h2 class="font-display text-[clamp(3rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-3%] text-text">
              О проекте
            </h2>
            <div class="space-y-4 font-sans text-sm leading-6 text-text/78">
              <p
                v-for="paragraph in landingAboutParagraphs"
                :key="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>

        <NuxtLink
          :to="ROUTES.SHOOTING_REQUEST"
          class="inline-flex w-fit min-h-11 items-center justify-center gap-2 border border-accent bg-accent px-4 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.12em] text-text-on-accent transition-colors hover:border-text"
        >
          Стать героем
          <ArrowText />
        </NuxtLink>
      </div>

      <div class="relative aspect-video border border-border-strong bg-surface lg:w-2/3">
        <NuxtImg
          src="/uploads/frame-118-1784803179906.png"
          alt="Превью видео проекта Кто здесь главный?"
          class="h-full w-full object-cover"
          densities="x1 x2"
        />
        <div class="pointer-events-none absolute inset-0 bg-linear-to-tr from-text/10 via-transparent to-transparent" />
        <button
          type="button"
          aria-label="Запустить промо-видео"
          class="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-text-on-accent shadow-[0_12px_30px_rgba(219,42,0,0.35)]"
        >
          <Icon
            name="heroicons:play-20-solid"
            class="ml-1 h-7 w-7"
          />
        </button>
      </div>
    </div>
  </section>
</template>
