<script setup lang="ts">
withDefaults(defineProps<{
  desktopImage?: string
  mobileImage?: string
  href?: string
  fallbackText?: string
}>(), {
  desktopImage: '',
  mobileImage: '',
  href: '/',
  fallbackText: 'ЗДЕСЬ БУДЕТ БАННЕР\nС НОВЫМ МАТЕРИАЛОМ',
})
</script>

<template>
  <section class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
    <div class="mx-auto w-full max-w-[1920px]">
      <NuxtLink
        :to="href"
        class="group block overflow-hidden border border-border-strong bg-surface"
      >
        <picture v-if="desktopImage || mobileImage">
          <source
            v-if="mobileImage"
            media="(max-width: 768px)"
            :srcset="mobileImage"
          >
          <img
            :src="desktopImage || mobileImage"
            alt=""
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          >
        </picture>

        <div
          v-else
          class="flex min-h-[280px] items-center justify-center bg-text px-8 py-12 text-center sm:min-h-[340px]"
        >
          <p class="font-display text-[clamp(2rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text-on-accent whitespace-pre-line">
            {{ fallbackText }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
