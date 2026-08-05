<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import InputBasic from '@shared/ui/forms/InputBasic.vue'

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
    <div class="flex min-h-[600px] flex-col px-6 pb-12 pt-7 lg:hidden">
      <h2 class="font-display text-[66px] font-black uppercase leading-[66px] tracking-[-0.03em]">
        Стать
        <br>
        участником
      </h2>
      <p class="mt-2 font-sans text-[15.82px] font-bold uppercase leading-[13.84px]">
        Заполните ваши данные для связи
      </p>

      <form
        class="mt-20 lg:mt-8 space-y-6"
        @submit.prevent="onSubmit"
      >
        <InputBasic
          v-model="form.name"
          label="Ваше имя*"
          name="name"
          type="text"
          autocomplete="name"
          required
          :minlength="2"
          placeholder="Имя"
        />
        <div class="mb-40 lg:mb-8">
          <InputBasic
            v-model="form.phone"
            label="Номер телефона*"
            name="phone"
            type="tel"
            autocomplete="tel"
            required
            :minlength="5"
            placeholder="+7"
          />
        </div>
        <button
          type="submit"
          :disabled="status === 'loading'"
          class="w-full border border-white py-3 font-sans text-[14px] font-normal uppercase leading-[14px] text-text-on-accent transition-colors hover:border-white hover:bg-white hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          Отправить
        </button>
        <NuxtLink
          :to="ROUTES.SHOOTING_REQUEST"
          class="mt-2 block w-full bg-surface py-3 text-center font-sans text-[14px] font-normal uppercase leading-[14px] text-accent transition-colors hover:bg-gray-100"
        >
          Узнать подробнее
        </NuxtLink>
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

    <div class="mx-auto hidden w-full max-w-[1920px] flex-col gap-14 px-10 pb-10 pt-10 lg:flex lg:min-h-[888px] lg:justify-between lg:gap-0">
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
          <InputBasic
            v-model="form.name"
            label="Ваше имя*"
            name="name"
            type="text"
            autocomplete="name"
            required
            :minlength="2"
            placeholder="Имя"
          />
          <InputBasic
            v-model="form.phone"
            label="Номер телефона*"
            name="phone"
            type="tel"
            autocomplete="tel"
            required
            :minlength="5"
            placeholder="+7"
          />
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
