<script setup lang="ts">
withDefaults(defineProps<{
  success?: boolean
  error?: boolean
  redirectPath?: string
  title?: string
  description?: string
  headline?: string
}>(), {
  redirectPath: '/shooting-request?success=1',
  title: 'Стать участником',
  description: 'Оставьте короткую заявку, и мы свяжемся с вами, чтобы обсудить формат участия в проекте.',
  headline: 'Готовы\nк проекту?',
})
</script>

<template>
  <section
      id="shooting"
      class="bg-accent px-4 py-12 text-text-on-accent sm:px-6 lg:px-10 lg:py-16"
  >
    <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h2 class="max-w-[38rem] font-display text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
          {{ title }}
        </h2>
        <p class="max-w-[34rem] font-sans text-sm leading-6 text-text-on-accent/88 sm:text-base">
          {{ description }}
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-end">
        <div class="font-display text-[clamp(4.5rem,16vw,12rem)] font-black uppercase leading-[0.8] tracking-[-0.05em] whitespace-pre-line">
          {{ headline }}
        </div>

        <div class="border border-white/30 bg-text/8 p-5 backdrop-blur sm:p-6">
          <div
            v-if="success"
            class="mb-6 border border-white/30 bg-white/12 px-4 py-4 font-sans text-sm leading-6 sm:text-base"
            role="status"
          >
            Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
          </div>

          <div
            v-else-if="error"
            class="mb-6 border border-white/30 bg-text/14 px-4 py-4 font-sans text-sm leading-6 sm:text-base"
            role="alert"
          >
            Не удалось отправить заявку. Проверьте данные и попробуйте снова.
          </div>

          <form
            action="/api/shooting-request"
            method="POST"
            class="grid gap-5"
          >
            <input
              type="hidden"
              name="redirect"
              :value="redirectPath"
            >

            <label class="grid gap-2">
              <span class="font-sans text-sm uppercase leading-4">Ваше имя*</span>
              <input
                type="text"
                name="name"
                required
                minlength="2"
                autocomplete="name"
                class="min-h-12 border-0 border-b-2 border-white bg-transparent px-0 py-2 font-sans text-base leading-5 text-text-on-accent outline-none placeholder:text-text-on-accent/55"
              >
            </label>

            <label class="grid gap-2">
              <span class="font-sans text-sm uppercase leading-4">Номер телефона*</span>
              <input
                type="tel"
                name="phone"
                required
                minlength="5"
                autocomplete="tel"
                class="min-h-12 border-0 border-b-2 border-white bg-transparent px-0 py-2 font-sans text-base leading-5 text-text-on-accent outline-none placeholder:text-text-on-accent/55"
              >
            </label>

            <button
              type="submit"
              class="mt-2 inline-flex min-h-12 items-center justify-center border border-white bg-transparent px-5 py-3 font-sans text-base uppercase leading-4 text-text-on-accent transition-colors hover:bg-white hover:text-text"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
