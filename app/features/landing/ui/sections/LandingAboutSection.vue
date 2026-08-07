<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import SiteLogo from '@shared/ui/logo/SiteLogo.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

const props = defineProps<{
  title: string
  text: string
}>()

const logoRef = ref<HTMLElement | null>(null)

defineExpose({ logoRef })

const paragraphs = computed(() => props.text.split(/\n{2,}/).filter(Boolean))
</script>

<template>
  <section
    id="landing-about-section"
    class="relative bg-bg"
  >
    <span
      ref="logoRef"
      class="absolute left-4 top-4 sm:left-6 sm:top-6 lg:left-10 lg:top-16 hidden xl:block"
    >
      <SiteLogo />
    </span>
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:gap-12 lg:px-10 lg:py-16">
      <div class="flex flex-col justify-end gap-8 lg:w-1/3">
        <div class="space-y-6">

          <div class="space-y-5">
            <SectionTitle>
              {{ title }}
            </SectionTitle>
            <div class="space-y-4 font-sans text-sm leading-6 text-text/78">
              <p
                v-for="paragraph in paragraphs"
                :key="paragraph"
              >
                {{ paragraph }}
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

      <div class="relative aspect-video border border-border-strong bg-surface lg:w-2/3">
        <img
          src="/uploads/frame-118-1784803179906.png"
          alt="Превью видео проекта Кто здесь главный?"
          class="h-full w-full object-cover"
        />
        <div class="pointer-events-none absolute inset-0 bg-linear-to-tr from-text/10 via-transparent to-transparent" />
        <button
          type="button"
          aria-label="Запустить промо-видео"
          class="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-text-on-accent shadow-[0_12px_30px_rgba(219,42,0,0.35)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="ml-1 h-7 w-7"
          >
            <path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>
