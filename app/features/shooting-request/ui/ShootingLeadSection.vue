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
    class="bg-accent px-4 py-14 text-text-on-accent sm:px-6 lg:px-8 lg:py-20"
  >
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <div class="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
        <h2 class="font-display text-[clamp(3rem,9vw,6.6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
          {{ title }}
        </h2>
        <p class="max-w-[36rem] text-base leading-7 text-text-on-accent/88 sm:text-lg">
          {{ description }}
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] lg:items-end">
        <div class="font-display text-[clamp(4.5rem,16vw,11rem)] font-black uppercase leading-[0.8] tracking-[-0.05em] whitespace-pre-line">
          {{ headline }}
        </div>

        <div class="rounded-[30px] border border-white/24 bg-black/10 p-6 backdrop-blur sm:p-7">
          <div
            v-if="success"
            class="mb-6 rounded-[20px] border border-white/24 bg-white/12 px-4 py-4 text-sm leading-6 sm:text-base"
            role="status"
          >
            Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
          </div>

          <div
            v-else-if="error"
            class="mb-6 rounded-[20px] border border-white/24 bg-black/16 px-4 py-4 text-sm leading-6 sm:text-base"
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
              <span class="text-sm font-medium uppercase tracking-[0.12em]">Ваше имя *</span>
              <input
                type="text"
                name="name"
                required
                minlength="2"
                autocomplete="name"
                class="min-h-[3.25rem] rounded-full border border-white/24 bg-transparent px-5 text-base text-text-on-accent outline-none placeholder:text-text-on-accent/55 focus:border-white"
              >
            </label>

            <label class="grid gap-2">
              <span class="text-sm font-medium uppercase tracking-[0.12em]">Номер телефона *</span>
              <input
                type="tel"
                name="phone"
                required
                minlength="5"
                autocomplete="tel"
                class="min-h-[3.25rem] rounded-full border border-white/24 bg-transparent px-5 text-base text-text-on-accent outline-none placeholder:text-text-on-accent/55 focus:border-white"
              >
            </label>

            <button
              type="submit"
              class="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-surface px-6 text-sm font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-[#f2f2f0]"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
