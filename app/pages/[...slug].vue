<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

const config = useRuntimeConfig()
const event = useRequestEvent()

if (event) {
  setResponseStatus(event, 404)
}

useSeoMeta({
  title: `404 — ${config.public.siteName}`,
  description: config.public.siteDescription,
  ogTitle: `404 — ${config.public.siteName}`,
  ogDescription: config.public.siteDescription,
})
</script>

<template>
  <section class="bg-bg px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-32">
    <div class="mx-auto flex w-full max-w-[42rem] flex-col items-center border border-border-strong bg-surface px-6 py-12 text-center sm:px-10 sm:py-16">
      <p class="font-display text-[clamp(5rem,18vw,9rem)] font-black uppercase leading-[0.82] tracking-[-0.05em] text-accent">
        404
      </p>
      <h1 class="mt-4 font-display text-[clamp(2rem,7vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-text">
        Страница не найдена
      </h1>
      <p class="mt-4 max-w-[30rem] font-sans text-sm leading-6 text-text-muted sm:text-base">
        Запрашиваемая страница не существует или была удалена.
      </p>
      <NuxtLink
        :to="ROUTES.LANDING"
        class="mt-8 inline-flex min-h-12 items-center justify-center bg-accent px-5 py-3 font-sans text-base uppercase leading-4 text-text-on-accent transition-colors hover:bg-surface-invert"
      >
        На главную
      </NuxtLink>
    </div>
  </section>
</template>
