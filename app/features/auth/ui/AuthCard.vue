<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <section class="bg-bg px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
    <div class="mx-auto w-full max-w-[32rem]">
      <div class="border border-border-strong bg-surface px-5 py-8 sm:px-8 sm:py-10">
        <div class="mb-8 flex flex-col gap-2 text-center">
          <h1 class="font-display text-[clamp(2.5rem,8vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
            {{ title }}
          </h1>
          <p class="font-sans text-sm leading-5 text-text-muted sm:text-base">
            {{ subtitle }}
          </p>
        </div>

        <slot />
      </div>
    </div>
  </section>
</template>
