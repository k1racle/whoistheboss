<script setup lang="ts">
import type { ContactPageData } from '@features/contacts/model/contact-page.types'
import { SOCIAL_LINKS } from '@shared/social'

defineProps<ContactPageData & {
  success?: boolean
  error?: boolean
}>()
</script>

<template>
  <section class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-12">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl">
          Контакты
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg leading-8 text-text/68">
          Свяжитесь с нами удобным способом или оставьте заявку на съёмку.
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-[1.02fr_1fr]">
        <div class="rounded-[30px] border border-black/10 bg-surface p-8 shadow-[0_24px_64px_rgba(7,7,7,0.06)] sm:p-10">
          <h2 class="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Как с нами связаться
          </h2>

          <div class="mt-8 space-y-6">
            <div
              v-if="address"
              class="flex items-start gap-4"
            >
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium text-text/46">Адрес</p>
                <p class="mt-1 whitespace-pre-line text-base leading-7 text-text sm:text-lg">
                  {{ address }}
                </p>
              </div>
            </div>

            <div
              v-if="phone"
              class="flex items-start gap-4"
            >
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z"
                  />
                </svg>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium text-text/46">Телефон</p>
                <a
                  :href="`tel:${phone.replace(/\s+/g, '')}`"
                  class="mt-1 inline-flex text-base leading-7 text-text transition-colors hover:text-accent sm:text-lg"
                >
                  {{ phone }}
                </a>
              </div>
            </div>

            <div
              v-if="email"
              class="flex items-start gap-4"
            >
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m3 8 7.89 5.26a2 2 0 0 0 2.22 0L21 8"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                  />
                </svg>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium text-text/46">Email</p>
                <a
                  :href="`mailto:${email}`"
                  class="mt-1 inline-flex text-base leading-7 text-text transition-colors hover:text-accent sm:text-lg"
                >
                  {{ email }}
                </a>
              </div>
            </div>
          </div>

          <div class="mt-8 border-t border-black/10 pt-8">
            <p class="text-sm font-medium text-text/46">Мы в соцсетях</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <a
                v-for="link in SOCIAL_LINKS"
                :key="link.href"
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="inline-flex min-h-11 items-center rounded-full border border-black/10 px-4 text-sm font-semibold tracking-[0.12em] text-text transition-colors hover:border-accent hover:text-accent"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>

        <div
          v-if="mapSrc"
          class="overflow-hidden rounded-[30px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)]"
        >
          <iframe
            :src="mapSrc"
            title="Карта"
            class="h-full min-h-[360px] w-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <div
          v-else
          class="flex min-h-[360px] items-center justify-center rounded-[30px] border border-black/10 bg-surface px-8 text-center shadow-[0_24px_64px_rgba(7,7,7,0.06)]"
        >
          <p class="max-w-sm text-base leading-7 text-text/54 sm:text-lg">
            Добавьте ссылку на карту в настройках админки.
          </p>
        </div>
      </div>

      <div class="mx-auto w-full max-w-3xl rounded-[30px] border border-black/10 bg-surface p-8 shadow-[0_24px_64px_rgba(7,7,7,0.06)] sm:p-10">
        <div class="text-center">
          <h2 class="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Заявка на съёмку
          </h2>
          <p class="mx-auto mt-3 max-w-2xl text-base leading-7 text-text/68 sm:text-lg">
            Расскажите о вашем бизнесе, и мы свяжемся для обсуждения проекта.
          </p>
        </div>

        <div
          v-if="success"
          class="mt-8 rounded-[22px] border border-[#b9e2c9] bg-[#edf9f1] px-5 py-4 text-base leading-7 text-[#16673b]"
          role="status"
        >
          Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
        </div>

        <div
          v-else-if="error"
          class="mt-8 rounded-[22px] border border-accent bg-accent px-5 py-4 text-base leading-7 text-text-on-accent"
          role="alert"
        >
          Не удалось отправить заявку. Проверьте данные и попробуйте снова.
        </div>

        <form
          action="/api/shooting-request"
          method="POST"
          class="mt-8 space-y-6"
        >
          <input
            type="hidden"
            name="redirect"
            value="/contacts?success=1"
          >

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-text/74">Имя *</span>
            <input
              type="text"
              name="name"
              required
              minlength="2"
              autocomplete="name"
              class="min-h-[3.25rem] w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-base text-text outline-none transition-colors placeholder:text-text/36 focus:border-accent"
            >
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-text/74">Компания</span>
            <input
              type="text"
              name="company"
              autocomplete="organization"
              class="min-h-[3.25rem] w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-base text-text outline-none transition-colors placeholder:text-text/36 focus:border-accent"
            >
          </label>

          <div class="grid gap-6 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-text/74">Email *</span>
              <input
                type="email"
                name="email"
                required
                autocomplete="email"
                class="min-h-[3.25rem] w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-base text-text outline-none transition-colors placeholder:text-text/36 focus:border-accent"
              >
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-text/74">Телефон</span>
              <input
                type="tel"
                name="phone"
                autocomplete="tel"
                class="min-h-[3.25rem] w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-base text-text outline-none transition-colors placeholder:text-text/36 focus:border-accent"
              >
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-text/74">О проекте</span>
            <textarea
              name="message"
              rows="5"
              class="min-h-[152px] w-full rounded-2xl border border-black/10 bg-[#fafaf8] px-4 py-3 text-base leading-7 text-text outline-none transition-colors placeholder:text-text/36 focus:border-accent"
            />
          </label>

          <button
            type="submit"
            class="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold tracking-[0.14em] text-text-on-accent uppercase transition-colors hover:bg-[#b82600]"
          >
            Отправить заявку
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
