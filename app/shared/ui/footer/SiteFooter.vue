<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { SOCIAL_LINKS, type SocialLink } from '@shared/social'
import type { FooterMetaItem } from '@shared/types/site-footer'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'

withDefaults(defineProps<{
  socialLinks?: SocialLink[]
  metaItems?: FooterMetaItem[]
  trademarkLegalText?: string
}>(), {
  socialLinks: () => SOCIAL_LINKS,
  metaItems: () => [
    { text: 'ИП Батагов А.А.', href: '' },
    { text: 'Пошта Почта', href: '' },
    { text: 'Политика конф-ти', href: '/privacy-policy' },
  ],
  trademarkLegalText: '«МАРШРУТ ПОСТРОЕН»® — зарегистрированный товарный знак. Свидетельство РФ № 1177775.',
})

const pageLinks = [
  { label: 'Главная', to: ROUTES.LANDING },
  { label: 'Предприниматели', to: ROUTES.ENTREPRENEURS },
  { label: 'Бизнес', to: ROUTES.COMPANIES },
  { label: 'Журнал', to: ROUTES.BLOG },
  { label: 'Товарный знак «Маршрут Построен»', to: ROUTES.TRADEMARK },
] as const

const ctaWords = ['Готовы', 'к', 'обсуждению', 'проекта', '?'] as const

</script>

<template>
  <footer
    id="contacts"
    class="min-h-[520px] bg-surface text-text"
  >
    <div class="mx-auto flex min-h-[520px] w-full max-w-[1920px] flex-col px-4 pb-6 pt-9 sm:px-6 sm:pt-10 lg:px-10 lg:pt-12">
      <div class="grid grid-cols-2 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(700px,44%)]">
        <nav
          class="grid justify-items-start gap-4"
          aria-label="Разделы сайта"
        >
          <NuxtLink
            v-for="link in pageLinks"
            :key="link.label"
            :to="link.to"
            class="font-sans text-sm uppercase leading-4 text-text transition-colors hover:text-accent lg:text-base"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <nav
          v-if="socialLinks.length"
          class="grid content-start justify-items-end gap-4 xl:grid-cols-[1.15fr_1fr_11rem] xl:gap-x-6 xl:text-right"
          aria-label="Социальные сети"
        >
          <a
            v-for="link in socialLinks"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="font-sans text-sm uppercase leading-4 text-text transition-colors hover:text-accent lg:text-base"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>

      <div class="mt-auto grid gap-10 pt-16 sm:pt-20 xl:grid-cols-[minmax(0,1fr)_minmax(700px,44%)] xl:items-end xl:pt-24">
        <div class="flex flex-col items-start gap-4">
          <p class="flex flex-wrap gap-x-[1.65rem] gap-y-1 font-sans text-sm uppercase leading-4 text-text sm:text-base">
            <span
              v-for="word in ctaWords"
              :key="word"
            >{{ word }}</span>
          </p>
          <ButtonLink
            :to="ROUTES.SHOOTING_REQUEST"
            arrow="mark"
            variant="flat"
            :emphasis="false"
            class="sm:text-base"
          >
            Стать героем
          </ButtonLink>
        </div>

        <div class="grid gap-x-6 gap-y-2 font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm xl:grid-cols-[1.15fr_1fr_11rem] xl:items-end xl:justify-items-end xl:text-right xl:text-base">
          <template
            v-for="(item, index) in metaItems"
            :key="`${item.text}-${item.href}`"
          >
            <NuxtLink
              v-if="item.href.startsWith('/') && !item.href.startsWith('//')"
              :to="item.href"
              class="transition-colors hover:text-accent"
              :class="{ 'xl:col-start-3': index === metaItems.length - 1 }"
            >
              {{ item.text }}
            </NuxtLink>
            <a
              v-else-if="item.href"
              :href="item.href"
              class="transition-colors hover:text-accent"
              :class="{ 'xl:col-start-3': index === metaItems.length - 1 }"
              target="_blank"
              rel="noopener"
            >
              {{ item.text }}
            </a>
            <span v-else :class="{ 'xl:col-start-3': index === metaItems.length - 1 }">{{ item.text }}</span>
          </template>
        </div>
      </div>

      <p class="mt-6 max-w-5xl font-sans text-[10px] leading-3 text-text-muted sm:text-xs sm:leading-4">
        Instagram, Facebook, WhatsApp принадлежат компании Meta, признанной экстремистской на территории Российской Федерации.
      </p>
      <NuxtLink
        v-if="trademarkLegalText"
        :to="ROUTES.TRADEMARK"
        class="mt-2 max-w-5xl font-sans text-[10px] leading-3 text-text-muted transition-colors hover:text-accent sm:text-xs sm:leading-4"
      >
        {{ trademarkLegalText }}
      </NuxtLink>
    </div>
  </footer>
</template>
