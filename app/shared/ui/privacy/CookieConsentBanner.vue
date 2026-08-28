<script setup lang="ts">
type Consent = 'accepted' | 'rejected'

const STORAGE_KEY = 'marshrut-cookie-consent-v1'
const isVisible = ref(false)
const hasChoice = ref(true)

const reveal = () => {
  if (!hasChoice.value) isVisible.value = true
  removeInteractionListeners()
}

const removeInteractionListeners = () => {
  window.removeEventListener('pointerdown', reveal)
  window.removeEventListener('keydown', reveal)
  window.removeEventListener('scroll', reveal)
}

const choose = (consent: Consent) => {
  localStorage.setItem(STORAGE_KEY, consent)
  hasChoice.value = true
  isVisible.value = false
  window.dispatchEvent(new CustomEvent('marshrut-cookie-consent', { detail: consent }))
}

onMounted(() => {
  hasChoice.value = Boolean(localStorage.getItem(STORAGE_KEY))
  if (hasChoice.value) return
  window.addEventListener('pointerdown', reveal, { once: true })
  window.addEventListener('keydown', reveal, { once: true })
  window.addEventListener('scroll', reveal, { once: true, passive: true })
})

onBeforeUnmount(removeInteractionListeners)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-5 opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="translate-y-5 opacity-0"
  >
    <aside
      v-if="isVisible"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      class="fixed inset-x-3 bottom-3 z-[80] border border-text/20 bg-surface p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:left-auto sm:right-5 sm:w-[min(34rem,calc(100vw-2.5rem))] sm:p-5"
    >
      <div class="flex items-start gap-3">
        <span class="mt-1 size-3 shrink-0 bg-accent" aria-hidden="true" />
        <div>
          <h2 id="cookie-consent-title" class="font-display text-2xl font-black uppercase leading-[0.9]">
            Cookies и аналитика
          </h2>
          <p id="cookie-consent-description" class="mt-2 font-sans text-sm leading-4 text-text/75">
            Мы используем необходимые данные для работы сайта. Яндекс.Метрика загрузится только после согласия.
          </p>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button type="button" class="min-h-12 border border-text bg-transparent px-4 font-sans text-sm uppercase transition-colors hover:bg-text hover:text-bg" @click="choose('rejected')">
          Не принимать
        </button>
        <button type="button" class="min-h-12 bg-accent px-4 font-sans text-sm uppercase text-text-on-accent transition-colors hover:bg-surface-invert" @click="choose('accepted')">
          Принять
        </button>
      </div>
    </aside>
  </Transition>
</template>
