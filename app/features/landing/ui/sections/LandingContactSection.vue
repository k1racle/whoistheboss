<script setup lang="ts">
import { ROUTES } from '@shared/navigation'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const form = reactive({ name: '', phone: '' })
const status = ref<FormStatus>('idle')

const canSubmit = computed(
  () => form.name.trim().length >= 2 && form.phone.trim().length >= 5,
)

const onSubmit = async () => {
  if (!canSubmit.value || status.value === 'loading') return

  status.value = 'loading'
  try {
    await $fetch('/api/shooting-request', {
      method: 'POST',
      body: { name: form.name.trim(), phone: form.phone.trim() },
    })
    status.value = 'success'
    form.name = ''
    form.phone = ''
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <section
    id="shooting"
    class="relative isolate overflow-hidden bg-accent text-text-on-accent"
  >
    <div class="mx-auto flex min-h-[760px] w-full max-w-[1920px] flex-col gap-14 px-5 pb-32 pt-7 lg:min-h-[888px] lg:justify-between lg:gap-0 lg:px-10 lg:pb-10 lg:pt-10">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <h2 class="max-w-[520px] font-sans text-[26px] font-bold uppercase leading-8 tracking-[-0.04em] lg:text-[32px]">
          Заполните ваши данные
          <br>
          для связи
        </h2>

        <form
          class="flex w-full max-w-[471px] flex-col gap-[30px] lg:gap-[54px]"
          @submit.prevent="onSubmit"
        >
          <label class="flex flex-col gap-2">
            <span class="font-sans text-base leading-4">Ваше имя*</span>
            <input
              v-model="form.name"
              name="name"
              type="text"
              autocomplete="name"
              required
              minlength="2"
              class="h-[22px] w-full border-0 border-b-2 border-white bg-transparent p-0 font-sans text-base leading-4 text-text-on-accent outline-none placeholder:text-text-on-accent/50"
              placeholder="Имя"
            >
          </label>
          <label class="flex flex-col gap-2">
            <span class="font-sans text-base leading-4">Номер телефона*</span>
            <input
              v-model="form.phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              required
              minlength="5"
              class="h-[22px] w-full border-0 border-b-2 border-white bg-transparent p-0 font-sans text-base leading-4 text-text-on-accent outline-none placeholder:text-text-on-accent/50"
              placeholder="+7"
            >
          </label>
          <button
            type="submit"
            :disabled="status === 'loading'"
            class="mt-1 min-h-[51px] w-full border border-white bg-transparent px-4 py-2 font-sans text-[22px] uppercase leading-[22px] tracking-[-0.88px] text-text-on-accent transition-colors hover:border-white hover:bg-white hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            Отправить
          </button>
          <p
            v-if="status === 'success'"
            class="font-sans text-sm leading-5"
            role="status"
          >
            Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
          </p>
          <p
            v-else-if="status === 'error'"
            class="font-sans text-sm leading-5"
            role="alert"
          >
            Не удалось отправить заявку. Попробуйте ещё раз.
          </p>
        </form>
      </div>

      <div class="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <p
          class="font-display text-[clamp(4.25rem,20vw,13.62rem)] font-black uppercase leading-[0.78] tracking-[-0.03em]"
          aria-label="Стать участником"
        >
          <span class="block">Стать</span>
          <span class="block">участником</span>
        </p>

        <NuxtLink
          :to="ROUTES.SHOOTING_REQUEST"
          class="inline-flex min-h-[49px] w-full items-center justify-center bg-surface px-4 py-2 font-sans text-[22px] uppercase leading-[22px] tracking-[-0.88px] text-text transition-colors hover:bg-surface-invert hover:text-text-on-accent lg:w-[471px]"
        >
          Узнать подробнее
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
