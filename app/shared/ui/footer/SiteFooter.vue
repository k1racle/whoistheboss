<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { SOCIAL_LINKS, type SocialLink } from '@shared/social'
import type { FooterMetaItem } from '@shared/types/site-footer'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'

withDefaults(defineProps<{
  socialLinks?: SocialLink[]
  metaItems?: FooterMetaItem[]
}>(), {
  socialLinks: () => SOCIAL_LINKS,
  metaItems: () => [
    { text: 'ИП Батагов А.А.', href: '' },
    { text: 'Пошта Почта', href: '' },
    { text: 'Политика конф-ти', href: '' },
  ],
})

const pageLinks = [
  { label: 'Предприниматели', to: ROUTES.ENTREPRENEURS },
  { label: 'Бизнес', to: ROUTES.COMPANIES },
  { label: 'Журнал', to: ROUTES.BLOG },
] as const

const ctaWords = ['Готовы', 'к', 'обсуждению', 'проекта', '?'] as const

</script>

<template>
  <footer
    id="contacts"
    class="bg-surface text-text"
  >
    <div class="mx-auto flex w-full max-w-[1920px] flex-col px-4 pb-6 pt-9 sm:px-6 sm:pt-10 lg:px-10 lg:pt-12">
      <div class="grid grid-cols-2 items-start gap-8 lg:flex lg:justify-between">
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
          class="grid content-start justify-items-end gap-4 lg:grid-cols-3 lg:gap-x-[4.75rem]"
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

      <div class="mt-16 flex flex-col gap-10 sm:mt-20 lg:mt-24 lg:flex-row lg:items-end lg:justify-between">
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

        <div class="flex flex-wrap items-center gap-x-8 gap-y-2 font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm lg:justify-end lg:text-base">
          <template
            v-for="item in metaItems"
            :key="`${item.text}-${item.href}`"
          >
            <NuxtLink
              v-if="item.href.startsWith('/') && !item.href.startsWith('//')"
              :to="item.href"
              class="transition-colors hover:text-accent"
            >
              {{ item.text }}
            </NuxtLink>
            <a
              v-else-if="item.href"
              :href="item.href"
              class="transition-colors hover:text-accent"
              target="_blank"
              rel="noopener"
            >
              {{ item.text }}
            </a>
            <span v-else>{{ item.text }}</span>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>
