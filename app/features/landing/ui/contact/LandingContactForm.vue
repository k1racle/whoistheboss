<script setup lang="ts">
import { ROUTES } from '@shared/navigation'
import InputBasic from '@shared/ui/forms/InputBasic.vue'

defineProps<{
  status: 'idle' | 'loading' | 'success' | 'error'
}>()

const emit = defineEmits<{
  submit: []
}>()

const name = defineModel<string>('name', { required: true })
const phone = defineModel<string>('phone', { required: true })
</script>

<template>
  <form
    class="flex w-full flex-col lg:w-[471px] lg:shrink-0"
    :aria-busy="status === 'loading'"
    @submit.prevent="emit('submit')"
  >
    <div class="flex flex-col gap-6 lg:gap-[54px]">
      <InputBasic
        v-model="name"
        label="Ваше имя*"
        name="name"
        type="text"
        autocomplete="name"
        required
        :minlength="2"
        placeholder="Имя"
      />

      <InputBasic
        v-model="phone"
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
      class="mt-28 min-h-11 w-full cursor-pointer border border-white bg-transparent px-4 py-3 font-sans text-sm font-normal uppercase leading-none text-text-on-accent transition-colors hover:border-white hover:bg-white hover:text-text disabled:cursor-not-allowed disabled:opacity-60 lg:mt-[54px] lg:min-h-[51px] lg:py-2 lg:text-[22px] lg:leading-[22px] lg:tracking-[-0.88px]"
    >
      Отправить
    </button>

    <p
      v-if="status === 'success'"
      class="mt-4 font-sans text-sm leading-5"
      role="status"
    >
      Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.
    </p>

    <p
      v-else-if="status === 'error'"
      class="mt-4 font-sans text-sm leading-5"
      role="alert"
    >
      Не удалось отправить заявку. Попробуйте ещё раз.
    </p>

    <NuxtLink
      :to="ROUTES.SHOOTING_REQUEST"
      class="mt-4 inline-flex min-h-11 w-full items-center justify-center bg-surface px-4 py-3 text-center font-sans text-sm font-normal uppercase leading-none text-accent transition-colors hover:bg-surface-invert hover:text-text-on-accent lg:mt-5 lg:min-h-[49px] lg:py-2 lg:text-[22px] lg:leading-[22px] lg:tracking-[-0.88px] xl:mb-[1.5625rem] xl:mt-auto"
    >
      Узнать подробнее
    </NuxtLink>
  </form>
</template>
