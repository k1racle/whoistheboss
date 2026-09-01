<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import ButtonLink from '@shared/ui/buttons/ButtonLink.vue'

const props = withDefaults(defineProps<{
  statusCode?: number
}>(), {
  statusCode: 404,
})

const isNotFound = computed(() => props.statusCode === 404)
const heading = computed(() => isNotFound.value ? 'Маршрут не найден' : 'Маршрут прерван')
const description = computed(() => isNotFound.value
  ? 'Такой страницы нет: возможно, она переехала или адрес набран с ошибкой. Выберите новое направление.'
  : 'На этом участке возникла ошибка. Вернитесь на главную и попробуйте продолжить маршрут оттуда.')

const recoveryRoutes = [
  { index: '01', label: 'Главная', to: ROUTES.LANDING },
  { index: '02', label: 'Предприниматели', to: ROUTES.ENTREPRENEURS },
  { index: '03', label: 'Бизнес', to: ROUTES.COMPANIES },
  { index: '04', label: 'Журнал', to: ROUTES.BLOG },
] as const

const recoverTo = async (event: MouseEvent, path: string) => {
  event.preventDefault()
  await clearError({ redirect: path })
}
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-bg text-text">
    <header class="relative z-20 border-b border-text/20">
      <div class="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-10">
        <NuxtLink
          :to="ROUTES.LANDING"
          class="group inline-flex min-h-11 items-center gap-3 font-sans text-xs font-bold uppercase leading-none tracking-[0.08em] sm:text-sm"
          aria-label="МАРШРУТ ПОСТРОЕН МЕДИАГИД — на главную"
          @click="recoverTo($event, ROUTES.LANDING)"
        >
          <span class="size-4 shrink-0 bg-accent transition-transform duration-200 group-hover:rotate-45 group-focus-visible:rotate-45" aria-hidden="true" />
          <span>МАРШРУТ ПОСТРОЕН</span>
          <span class="hidden text-text-muted sm:inline">МЕДИАГИД</span>
        </NuxtLink>

        <span class="font-sans text-xs uppercase tracking-[0.12em] text-text-muted sm:text-sm">
          [ ошибка {{ statusCode }} ]
        </span>
      </div>
    </header>

    <main class="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1920px] flex-col px-4 pb-5 pt-6 sm:min-h-[calc(100svh-4.5rem)] sm:px-6 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-8 xl:pr-28">
      <div class="flex items-center justify-between gap-5 border-b border-text/20 pb-3 font-sans text-[11px] uppercase leading-3 tracking-[0.1em] text-text-muted sm:text-xs">
        <span>[ точка назначения не определена ]</span>
        <span class="hidden sm:inline">55.7558° N · 37.6173° E</span>
      </div>

      <div class="relative isolate flex min-h-[15rem] flex-1 items-center justify-center py-8 sm:min-h-[21rem] lg:min-h-[24rem] lg:py-10">
        <p class="error-code relative z-0 m-0 select-none whitespace-nowrap font-display font-black uppercase text-accent" aria-hidden="true">
          <span>4</span><span class="error-code__zero">0</span><span>4</span>
        </p>

        <svg
          class="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[38%] w-full -translate-y-1/2 overflow-visible"
          viewBox="0 0 1200 180"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            class="error-route error-route--first"
            d="M0 138 H322 C380 138 382 42 454 42 H574"
          />
          <path
            class="error-route error-route--second"
            d="M626 42 H758 C826 42 826 138 890 138 H1200"
          />
          <rect x="306" y="128" width="20" height="20" class="fill-surface stroke-text" vector-effect="non-scaling-stroke" />
          <rect x="584" y="32" width="32" height="32" class="fill-accent stroke-text" vector-effect="non-scaling-stroke" />
          <rect x="884" y="128" width="20" height="20" class="fill-surface stroke-text" vector-effect="non-scaling-stroke" />
        </svg>

        <span class="absolute left-1/2 top-[calc(50%+2.15rem)] z-20 -translate-x-1/2 bg-text px-2 py-1 font-sans text-[10px] uppercase leading-none tracking-[0.1em] text-surface sm:top-[calc(50%+2.45rem)] sm:text-xs">
          связь потеряна
        </span>
      </div>

      <div class="relative z-20 grid border-t border-text/20 pt-5 sm:pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-12">
        <div>
          <h1 class="max-w-[12ch] font-display text-[clamp(3.25rem,11vw,8.5rem)] font-black uppercase leading-[0.78] tracking-[-0.035em] text-text">
            {{ heading }}
          </h1>
          <p class="mt-5 max-w-[39rem] font-sans text-sm leading-[1.08] text-text-muted sm:text-base lg:text-lg">
            {{ description }}
          </p>
          <ButtonLink
            :to="ROUTES.LANDING"
            class="mt-6 sm:mt-7"
            variant="flat"
            arrow="mark"
            emphasis
            @click="recoverTo($event, ROUTES.LANDING)"
          >
            На главную
          </ButtonLink>
        </div>

        <nav class="mt-9 border-t border-text/20 lg:mt-0" aria-label="Выбрать другой раздел">
          <NuxtLink
            v-for="route in recoveryRoutes"
            :key="route.to"
            :to="route.to"
            class="group grid min-h-12 grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-2 border-b border-text/20 font-sans text-sm uppercase transition-colors hover:bg-surface focus-visible:bg-surface sm:min-h-14 sm:grid-cols-[3rem_minmax(0,1fr)_2.5rem] sm:text-base"
            @click="recoverTo($event, route.to)"
          >
            <span class="text-xs text-text-muted">[{{ route.index }}]</span>
            <span>{{ route.label }}</span>
            <span class="translate-x-0 text-right text-xl leading-none text-accent transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden="true">↗</span>
          </NuxtLink>
        </nav>
      </div>
    </main>

    <div class="absolute bottom-0 right-0 top-[72px] hidden w-[72px] items-center justify-center border-l border-text/20 xl:flex" aria-hidden="true">
      <span class="font-display text-2xl font-black uppercase tracking-[0.08em] text-accent [writing-mode:vertical-rl]">
        вернуться в маршрут
      </span>
    </div>
  </div>
</template>

<style scoped>
.error-code {
  font-size: clamp(11rem, 39vw, 39rem);
  line-height: 0.66;
  letter-spacing: -0.075em;
}

.error-code__zero {
  color: transparent;
  -webkit-text-stroke: clamp(1.5px, 0.18vw, 3px) var(--color-text);
}

.error-route {
  fill: none;
  stroke: var(--color-text);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw-route 900ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.error-route--second {
  animation-delay: 280ms;
}

@keyframes draw-route {
  to {
    stroke-dashoffset: 0;
  }
}

@media (min-width: 640px) {
  .error-code {
    font-size: clamp(17rem, 37vw, 39rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .error-route {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
