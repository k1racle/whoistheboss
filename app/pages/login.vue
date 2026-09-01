<script setup lang="ts">
import AuthCard from '@features/auth/ui/AuthCard.vue'
import { ROUTES } from '@shared/navigation'
import { useManagedSeo } from '@shared/seo/use-managed-seo'

const route = useRoute()
const config = useRuntimeConfig()

const hasError = computed(() => route.query.error === '1')
const returnTo = computed(() => typeof route.query.returnTo === 'string' ? route.query.returnTo : '')

useManagedSeo({
  title: 'Вход',
  description: config.public.siteDescription,
})

useRobotsRule('noindex, nofollow')
</script>

<template>
  <AuthCard
    title="Вход"
    subtitle="Снова в деле"
  >
    <div
      v-if="hasError"
      class="mb-6 border border-accent bg-accent px-4 py-4 font-sans text-sm leading-5 text-text-on-accent"
      role="alert"
    >
      Ошибка входа. Проверьте email и пароль.
    </div>

    <form
      action="/api/auth/login"
      method="POST"
      class="flex flex-col gap-5"
    >
      <input
        v-if="returnTo"
        type="hidden"
        name="returnTo"
        :value="returnTo"
      >

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
          autocomplete="current-password"
          required
          minlength="6"
          class="min-h-12 border border-border-strong bg-transparent px-4 py-3 font-sans text-base leading-5 text-text outline-none transition-colors placeholder:text-text-muted/70 focus:border-accent"
        >
      </label>

      <button
        type="submit"
        class="mt-1 inline-flex min-h-12 w-full items-center justify-center bg-accent px-4 py-3 font-sans text-base uppercase leading-4 text-text-on-accent transition-colors hover:bg-surface-invert"
      >
        Войти
      </button>
    </form>

    <p class="mt-6 text-center font-sans text-sm leading-5 text-text-muted">
      Нет аккаунта?
      <NuxtLink
        :to="ROUTES.REGISTER"
        class="text-text transition-colors hover:text-accent"
      >
        Зарегистрироваться
      </NuxtLink>
    </p>
  </AuthCard>
</template>
