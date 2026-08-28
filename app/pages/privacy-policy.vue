<script setup lang="ts">
interface PrivacyPolicyResponse {
  text: string
}

const config = useRuntimeConfig()
const { data } = await useAsyncData('privacy-policy', () => $fetch<PrivacyPolicyResponse>('/api/privacy-policy'))

useSeoMeta({
  title: `Политика конфиденциальности — ${config.public.siteName}`,
  description: 'Политика конфиденциальности проекта «Маршрут построен».',
  ogTitle: `Политика конфиденциальности — ${config.public.siteName}`,
  ogDescription: 'Политика конфиденциальности проекта «Маршрут построен».',
})
</script>

<template>
  <main class="bg-bg px-4 py-16 text-text sm:px-6 sm:py-20 lg:px-10 lg:py-28">
    <article class="mx-auto w-full max-w-[76rem]">
      <p class="font-sans text-sm uppercase leading-4 text-accent sm:text-base">
        Документы
      </p>
      <h1 class="mt-5 max-w-full font-display text-[min(9vw,2.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] [overflow-wrap:anywhere] sm:max-w-[70rem] sm:text-[clamp(2.75rem,7vw,7rem)]">
        Политика конфиденциальности
      </h1>
      <div class="mt-12 border-t border-border-strong pt-8 sm:mt-16 sm:pt-10">
        <p
          v-if="data?.text"
          class="max-w-[75ch] whitespace-pre-wrap font-sans text-base leading-6 text-text [overflow-wrap:anywhere] sm:text-lg sm:leading-7"
        >{{ data.text }}</p>
        <p v-else class="font-sans text-base leading-6 text-text-muted">
          Текст политики конфиденциальности пока не опубликован.
        </p>
      </div>
    </article>
  </main>
</template>
