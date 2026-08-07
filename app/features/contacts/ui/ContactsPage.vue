<script setup lang="ts">
import type { ContactPageData } from '../model/contact-page.types'
import { SOCIAL_LINKS } from '@shared/social'

defineProps<ContactPageData & {
  success?: boolean
  error?: boolean
}>()
</script>

<template>
  <section class="bg-bg px-5 py-16 text-text lg:px-10 lg:py-24">
    <div class="mx-auto grid w-full max-w-[1920px] gap-10 lg:grid-cols-[1fr_2fr]">
      <div>
        <h1 class="font-display text-[clamp(64px,12vw,180px)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent">
          Контакты
        </h1>
        <div class="mt-10 grid gap-3 font-sans text-base uppercase leading-5">
          <a v-if="phone" :href="`tel:${phone}`" class="hover:text-accent">{{ phone }}</a>
          <a v-if="email" :href="`mailto:${email}`" class="hover:text-accent">{{ email }}</a>
          <p v-if="address">{{ address }}</p>
        </div>
        <div v-if="SOCIAL_LINKS.length" class="mt-10 flex flex-wrap gap-4">
          <a
            v-for="link in SOCIAL_LINKS"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="font-sans text-sm uppercase leading-4 hover:text-accent"
          >
            {{ link.label }}
          </a>
        </div>
      </div>

      <iframe
        v-if="mapSrc"
        :src="mapSrc"
        title="Карта"
        class="min-h-[360px] w-full border border-border-strong"
        loading="lazy"
      />
    </div>

    <p v-if="success" class="fixed bottom-5 right-5 z-50 bg-text px-5 py-4 font-sans text-sm leading-5 text-white" role="status">
      Заявка отправлена.
    </p>
    <p v-if="error" class="fixed bottom-5 right-5 z-50 bg-accent px-5 py-4 font-sans text-sm leading-5 text-white" role="alert">
      Не удалось отправить заявку.
    </p>
  </section>
</template>
