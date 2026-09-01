<script setup lang="ts">
import AuthCard from '@features/auth/ui/AuthCard.vue'
import { ROUTES } from '@shared/navigation'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const route = useRoute()
const config = useRuntimeConfig()

const errorMessage = computed(() => {
  if (route.query.error === '2') {
    return 'Пользователь с таким email уже существует.'
  }

  if (route.query.error === '1') {
    return 'Проверьте введенные данные и попробуйте снова.'
  }

  return ''
})

useManagedSeo({
  title: 'Регистрация',
  description: config.public.siteDescription,
})

useRobotsRule('noindex, nofollow')
</script>

<template>
  <AuthCard
    title="Регистрация"
    subtitle="Присоединяйтесь к сообществу"
  >
    <div
      v-if="errorMessage"
      class="mb-6 border border-accent bg-accent px-4 py-4 font-sans text-sm leading-5 text-text-on-accent"
      role="alert"
    >
      {{ errorMessage }}
    </div>

    <form
      action="/api/auth/register"
      method="POST"
      class="flex flex-col gap-5"
    >
      <label class="flex flex-col gap-2">
        <span class="font-sans text-sm uppercase leading-4 text-text">Имя</span>
        <input
          type="text"
          name="name"
          autocomplete="name"
          required
          minlength="2"
          class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
        >
      </label>

      <label class="flex flex-col gap-2">
        <span class="font-sans text-sm uppercase leading-4 text-text">Email</span>
        <input
          type="email"
          name="email"
          autocomplete="email"
          required
          class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
        >
      </label>

      <label class="flex flex-col gap-2">
        <span class="font-sans text-sm uppercase leading-4 text-text">Пароль</span>
        <input
          type="password"
          name="password"
          autocomplete="new-password"
          required
          minlength="6"
          class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
        >
      </label>

      <button
        type="submit"
        class="mt-1 inline-flex min-h-12 w-full items-center justify-center bg-accent px-4 py-3 font-sans text-base uppercase leading-4 text-text-on-accent transition-colors hover:bg-surface-invert"
      >
        Зарегистрироваться
      </button>
    </form>

    <p class="mt-6 text-center font-sans text-sm leading-5 text-text-muted">
      Уже есть аккаунт?
      <NuxtLink
        :to="ROUTES.LOGIN"
        class="text-text transition-colors hover:text-accent"
      >
        Войти
      </NuxtLink>
    </p>
  </AuthCard>
</template>
