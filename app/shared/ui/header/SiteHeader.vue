<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import { SOCIAL_LINKS, type SocialLink } from '@shared/social'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'
import type { PresenceCity } from '@shared/types/city'

const props = withDefaults(defineProps<{
  socialLinks?: SocialLink[]
  cities?: PresenceCity[]
}>(), {
  socialLinks: () => SOCIAL_LINKS,
  cities: () => [],
})

const navigationItems = [
  { label: 'Предприниматели', to: ROUTES.ENTREPRENEURS },
  { label: 'Бизнес', to: ROUTES.COMPANIES },
  { label: 'Журнал', to: ROUTES.BLOG },
] as const

const mobileNavigationItems = [
  ...navigationItems,
  { label: 'Съемка', to: ROUTES.SHOOTING_REQUEST },
] as const

const route = useRoute()
const isMenuOpen = ref(false)
const isCityMenuOpen = ref(false)
const currentCitySlug = computed(() => typeof route.params.city === 'string' ? route.params.city : '')
const currentCity = computed(() => props.cities.find(city => city.slug === currentCitySlug.value))

const pathWithoutCity = computed(() => {
  if (!currentCitySlug.value) return route.path
  const segments = route.path.split('/').filter(Boolean)
  const rest = segments.slice(1)
  return rest.length ? `/${rest.join('/')}` : '/'
})

const selectCity = async (slug?: string) => {
  isCityMenuOpen.value = false
  closeMenu()
  if (!slug) {
    sessionStorage.setItem('marshrut-city-navigation-bypass', '1')
    await navigateTo({ path: pathWithoutCity.value, query: route.query })
    return
  }
  localStorage.setItem('marshrut-presence-city-v1', slug)
  await navigateTo({
    path: `/${slug}${pathWithoutCity.value === '/' ? '' : pathWithoutCity.value}`,
    query: route.query,
  })
}

const closeMenu = () => {
  isMenuOpen.value = false
  isCityMenuOpen.value = false
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
          <span aria-hidden="true" class="hidden size-full bg-accent lg:block" />
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

        <div
          v-if="cities.length"
          class="relative hidden lg:block"
        >
          <button
            type="button"
            class="inline-flex min-h-11 items-center gap-3 border-l border-text/20 pl-6 font-sans text-sm uppercase leading-4 text-text transition-colors hover:text-accent xl:text-base"
            :aria-expanded="isCityMenuOpen"
            aria-controls="desktop-city-menu"
            @click="isCityMenuOpen = !isCityMenuOpen"
          >
            <span class="size-2.5 bg-accent" aria-hidden="true" />
            {{ currentCity?.name || 'Все города' }}
            <span
              aria-hidden="true"
              class="text-lg leading-none transition-transform"
              :class="{ 'rotate-45': isCityMenuOpen }"
            >+</span>
          </button>

          <div
            id="desktop-city-menu"
            class="absolute left-6 top-[calc(100%+0.75rem)] min-w-56 border border-text/15 bg-surface p-2 shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-[opacity,transform,visibility]"
            :class="isCityMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'"
          >
            <button
              type="button"
              class="flex min-h-11 w-full items-center justify-between px-3 text-left font-sans text-sm uppercase hover:bg-bg"
              :class="{ 'text-accent': !currentCitySlug }"
              @click="selectCity()"
            >
              <span>Все города</span><span>[ ↗ ]</span>
            </button>
            <button
              v-for="city in cities"
              :key="city.id"
              type="button"
              class="flex min-h-11 w-full items-center justify-between px-3 text-left font-sans text-sm uppercase hover:bg-bg"
              :class="{ 'bg-accent text-text-on-accent': city.slug === currentCitySlug }"
              @click="selectCity(city.slug)"
            >
              <span>{{ city.name }}</span><span>{{ city.slug }}</span>
            </button>
          </div>
        </div>
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

        <section
          v-if="cities.length"
          class="mt-auto w-full border-y border-text/15 py-4"
          aria-label="Выбор города"
        >
          <div class="flex flex-col gap-1">
            <button
              type="button"
              class="flex min-h-11 w-full items-center justify-between px-3 text-left font-sans text-sm uppercase transition-colors hover:bg-surface"
              :class="{ 'bg-accent text-text-on-accent': !currentCitySlug }"
              @click="selectCity()"
            >
              <span>Все города</span><span>[ ↗ ]</span>
            </button>
            <button
              v-for="city in cities"
              :key="city.id"
              type="button"
              class="flex min-h-11 w-full items-center justify-between px-3 text-left font-sans text-sm uppercase transition-colors hover:bg-surface"
              :class="{ 'bg-accent text-text-on-accent': city.slug === currentCitySlug }"
              @click="selectCity(city.slug)"
            >
              <span>{{ city.name }}</span><span class="text-xs">{{ city.slug }}</span>
            </button>
          </div>
        </section>

        <div
          v-if="socialLinks.length"
          class="flex flex-wrap justify-end gap-3"
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
