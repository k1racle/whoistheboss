<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { SOCIAL_LINKS, type SocialLink } from '@shared/social'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'

withDefaults(defineProps<{
  logoVisible?: boolean
  socialLinks?: SocialLink[]
}>(), {
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

const addDesktopMediaListener = () => {
  if (!desktopMedia) return
  if (typeof desktopMedia.addEventListener === 'function') {
    desktopMedia.addEventListener('change', handleDesktopChange)
    return
  }
  const legacyMedia = desktopMedia as unknown as {
    addListener?: (listener: (event: MediaQueryListEvent) => void) => void
  }
  legacyMedia.addListener?.(handleDesktopChange)
}

const removeDesktopMediaListener = () => {
  if (!desktopMedia) return
  if (typeof desktopMedia.removeEventListener === 'function') {
    desktopMedia.removeEventListener('change', handleDesktopChange)
    return
  }
  const legacyMedia = desktopMedia as unknown as {
    removeListener?: (listener: (event: MediaQueryListEvent) => void) => void
  }
  legacyMedia.removeListener?.(handleDesktopChange)
}

watch(() => route.fullPath, closeMenu)

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  desktopMedia = window.matchMedia('(min-width: 1024px)')
  addDesktopMediaListener()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  removeDesktopMediaListener()
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-bg/90 backdrop-blur-2xl">
    <div class="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:gap-6 lg:px-10 lg:py-4">
      <div class="flex min-w-0 items-center gap-6 lg:gap-12">
        <NuxtLink
          :to="ROUTES.LANDING"
          aria-label="Маршрут Построен"
          class="relative block size-4 shrink-0 before:absolute before:-inset-2 before:content-['']"
        >
          <span aria-hidden="true" class="block size-full bg-accent lg:hidden" />
          <span aria-hidden="true" class="hidden size-full shrink-0 lg:block">
            <Transition
              enter-active-class="transition-[opacity,transform] duration-150 ease-out"
              enter-from-class="-translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition-[opacity,transform] duration-150 ease-out"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="-translate-y-1 opacity-0"
              mode="out-in"
            >
              <span
                v-if="logoVisible"
                key="site-logo"
                class="block size-full bg-accent"
              />
              <span
                v-else
                key="logo-placeholder"
                class="block size-full bg-accent"
              />
            </Transition>
          </span>
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
        <ButtonLink
          :to="ROUTES.SHOOTING_REQUEST"
          size="header"
          variant="flat"
          :emphasis="false"
        >
          Стать героем
        </ButtonLink>

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
