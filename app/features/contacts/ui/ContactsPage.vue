<script setup lang="ts">
import type { ContactPageData } from '@features/contacts/model/contact-page.types'
import { SOCIAL_LINKS } from '@shared/social'

defineProps<ContactPageData & {
  success?: boolean
  error?: boolean
}>()
</script>

<template>
  <section class="bg-bg px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
    <div class="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
      <div class="max-w-[44rem] text-center sm:text-left">
        <h1 class="font-display text-[clamp(3rem,9vw,6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
          Контакты
        </h1>
        <p class="mt-4 font-sans text-base leading-6 text-text-muted sm:text-lg">
          Свяжитесь с нами удобным способом или оставьте заявку на съемку.
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div class="border border-border-strong bg-surface p-6 sm:p-8">
          <h2 class="font-display text-[clamp(2rem,5vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-text">
            Как с нами связаться
          </h2>

          <div class="mt-8 grid gap-5">
            <div
              v-if="address"
              class="grid gap-1"
            >
              <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Адрес</p>
              <p class="font-sans text-base leading-6 text-text sm:text-lg whitespace-pre-line">{{ address }}</p>
            </div>

            <div
              v-if="phone"
              class="grid gap-1"
            >
              <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Телефон</p>
              <a
                :href="`tel:${phone.replace(/\\s+/g, '')}`"
                class="font-sans text-base leading-6 text-text transition-colors hover:text-accent sm:text-lg"
              >
                {{ phone }}
              </a>
            </div>

            <div
              v-if="email"
              class="grid gap-1"
            >
              <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Email</p>
              <a
                :href="`mailto:${email}`"
                class="font-sans text-base leading-6 text-text transition-colors hover:text-accent sm:text-lg"
              >
                {{ email }}
              </a>
            </div>
          </div>

          <div class="mt-8 border-t border-border-strong pt-8">
            <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Мы в соцсетях</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <a
                v-for="link in SOCIAL_LINKS"
                :key="link.href"
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="inline-flex min-h-10 items-center border border-border-strong px-4 py-2 font-sans text-sm uppercase leading-4 text-text transition-colors hover:border-accent hover:text-accent"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>

        <div
          v-if="mapSrc"
          class="min-h-[320px] overflow-hidden border border-border-strong bg-surface"
        >
          <iframe
            :src="mapSrc"
            title="Карта"
            class="h-full min-h-[320px] w-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <div
          v-else
          class="flex min-h-[320px] items-center justify-center border border-border-strong bg-surface p-8 text-center"
        >
          <p class="max-w-[24rem] font-sans text-base leading-6 text-text-muted sm:text-lg">
            Ссылка на карту пока не добавлена в настройках.
          </p>
        </div>
      </div>

      <div class="mx-auto w-full max-w-[52rem] border border-border-strong bg-surface p-6 sm:p-8">
        <div class="text-center">
          <h2 class="font-display text-[clamp(2rem,6vw,3.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-text">
            Заявка на съемку
          </h2>
          <p class="mt-3 font-sans text-base leading-6 text-text-muted sm:text-lg">
            Расскажите о вашем бизнесе, и мы свяжемся для обсуждения проекта.
          </p>
        </div>

        <div
          v-if="success"
          class="mt-8 border border-[#1c8b4d] bg-[#eaf8ef] px-4 py-4 font-sans text-sm leading-6 text-[#145f35] sm:text-base"
          role="status"
        >
          Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
        </div>

        <div
          v-else-if="error"
          class="mt-8 border border-accent bg-accent px-4 py-4 font-sans text-sm leading-6 text-text-on-accent sm:text-base"
          role="alert"
        >
          Не удалось отправить заявку. Проверьте данные и попробуйте снова.
        </div>

        <form
          action="/api/shooting-request"
          method="POST"
          class="mt-8 grid gap-5"
        >
          <input
            type="hidden"
            name="redirect"
            value="/contacts?success=1"
          >

          <label class="grid gap-2">
            <span class="font-sans text-sm uppercase leading-4 text-text">Имя*</span>
            <input
              type="text"
              name="name"
              required
              minlength="2"
              autocomplete="name"
              class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
            >
          </label>

          <label class="grid gap-2">
            <span class="font-sans text-sm uppercase leading-4 text-text">Компания</span>
            <input
              type="text"
              name="company"
              autocomplete="organization"
              class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
            >
          </label>

          <div class="grid gap-5 md:grid-cols-2">
            <label class="grid gap-2">
              <span class="font-sans text-sm uppercase leading-4 text-text">Email*</span>
              <input
                type="email"
                name="email"
                required
                autocomplete="email"
                class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
              >
            </label>

            <label class="grid gap-2">
              <span class="font-sans text-sm uppercase leading-4 text-text">Телефон</span>
              <input
                type="tel"
                name="phone"
                autocomplete="tel"
                class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
              >
            </label>
          </div>

          <label class="grid gap-2">
            <span class="font-sans text-sm uppercase leading-4 text-text">О проекте</span>
            <textarea
              name="message"
              rows="5"
              class="min-h-[140px] border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-6 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
            />
          </label>

          <button
            type="submit"
            class="inline-flex min-h-12 items-center justify-center bg-accent px-5 py-3 font-sans text-base uppercase leading-4 text-text-on-accent transition-colors hover:bg-surface-invert"
          >
            Отправить заявку
          </button>
        </form>
      </div>
    </div>
  </section>
</template>
