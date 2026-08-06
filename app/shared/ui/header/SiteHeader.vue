<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { SOCIAL_LINKS, type SocialLink } from '@shared/social'
import ArrowText from '@shared/ui/icons/ArrowText.vue'
import SiteLogo from '@shared/ui/logo/SiteLogo.vue'

withDefaults(defineProps<{
  logoSrc?: string
  logoVisible?: boolean
  socialLinks?: SocialLink[]
}>(), {
  logoSrc: '/images/image-29.svg',
  logoVisible: true,
  socialLinks: () => SOCIAL_LINKS,
})

const navigationItems = [
  { label: 'Предприниматели', to: ROUTES.ENTREPRENEURS },
  { label: 'Компании', to: ROUTES.COMPANIES },
  { label: 'Блог', to: ROUTES.BLOG },
] as const

const mobileNavigationItems = [
  ...navigationItems,
  { label: 'Съемка', to: ROUTES.SHOOTING_REQUEST },
] as const

const route = useRoute()
const isMenuOpen = ref(false)

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}

let desktopMedia: MediaQueryList | undefined
const handleDesktopChange = (event: MediaQueryListEvent) => {
  if (event.matches) closeMenu()
}

watch(() => route.fullPath, closeMenu)

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  desktopMedia = window.matchMedia('(min-width: 1024px)')
  desktopMedia.addEventListener('change', handleDesktopChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  desktopMedia?.removeEventListener('change', handleDesktopChange)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-bg/90 backdrop-blur-2xl">
    <div class="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:gap-6 lg:px-10 lg:py-4">
      <div class="flex min-w-0 items-center gap-6 lg:gap-12">
        <NuxtLink
          :to="ROUTES.LANDING"
          aria-label="Кто здесь главный?"
          class="shrink-0 visible translate-y-0 scale-100 opacity-100 transition-[opacity,transform,visibility] duration-[120ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          :class="logoVisible
            ? 'lg:visible lg:translate-y-0 lg:scale-100 lg:opacity-100'
            : 'lg:invisible lg:-translate-y-1 lg:scale-95 lg:opacity-0 lg:pointer-events-none'"
        >
          <SiteLogo :src="logoSrc" />
        </NuxtLink>

        <nav
          class="hidden items-center gap-8 lg:flex xl:gap-12"
          aria-label="Основная навигация"
        >
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            class="font-sans text-sm uppercase leading-4 text-text/80 transition-colors hover:text-accent xl:text-base"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="flex shrink-0 items-center gap-2 sm:gap-3">
        <NuxtLink
          :to="ROUTES.SHOOTING_REQUEST"
          class="inline-flex min-h-9 items-center justify-center gap-2 bg-accent px-3 py-2 font-sans text-[13px] uppercase leading-4 text-text-on-accent transition-colors sm:min-h-10 sm:px-4 sm:text-sm lg:text-base"
        >
          Стать героем
          <ArrowText />
        </NuxtLink>

        <button
          type="button"
          class="relative flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
          :aria-expanded="isMenuOpen"
          aria-controls="site-mobile-menu"
          :aria-label="isMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
          @click="toggleMenu"
        >
          <span
            class="block h-[3px] w-7 bg-text transition-transform duration-200"
            :class="{ 'translate-y-[5px] rotate-45': isMenuOpen }"
          />
          <span
            class="block h-[3px] w-7 bg-text transition-transform duration-200"
            :class="{ '-translate-y-[5px] -rotate-45': isMenuOpen }"
          />
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <div
      id="site-mobile-menu"
      class="fixed inset-0 z-50 transition-[opacity,visibility] duration-300 lg:hidden"
      :class="isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'"
      :aria-hidden="!isMenuOpen"
    >
      <div
        class="absolute inset-0 bg-bg/90 backdrop-blur"
        @click="closeMenu"
      />
      <div class="relative flex h-full flex-col items-end gap-8 overflow-y-auto px-5 pb-8 pt-24 sm:px-8">
        <nav
          class="flex w-full flex-col items-end gap-4"
          aria-label="Мобильная навигация"
        >
          <NuxtLink
            v-for="(item, index) in mobileNavigationItems"
            :key="item.to"
            :to="item.to"
            class="inline-flex min-h-[38px] items-center justify-center bg-surface px-4 py-2.5 font-sans text-sm font-medium uppercase leading-4 text-text transition-[opacity,transform,color] duration-300 ease-out hover:text-accent"
            :class="isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            :style="{ transitionDelay: isMenuOpen ? `${80 + index * 50}ms` : '0ms' }"
            @click="closeMenu"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div
          v-if="socialLinks.length"
          class="mt-auto flex flex-wrap justify-end gap-3"
        >
          <a
            v-for="(link, index) in socialLinks"
            :key="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="inline-flex min-h-[42px] items-center bg-surface/90 px-4 py-2.5 font-sans text-[15px] font-medium uppercase leading-4 text-text transition-[opacity,transform,color] duration-300 ease-out hover:text-accent"
            :class="isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
            :style="{ transitionDelay: isMenuOpen ? `${280 + index * 50}ms` : '0ms' }"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>
