<script setup lang="ts">
defineProps<{
  title: string
  textOne: string
  textTwo: string
}>()
</script>

<template>
  <section class="bg-bg">
    <div class="flex w-full flex-col items-center justify-center bg-accent px-5 py-14 text-center text-text-on-accent lg:px-6 lg:py-20">
      <h2 class="m-0 w-1/2 whitespace-pre-line font-display text-[80px] font-black uppercase leading-[80px] tracking-[-0.03em] text-current max-lg:w-full max-lg:text-[clamp(45px,12vw,72px)] max-lg:leading-[0.92]">
        {{ title }}
      </h2>
      <p v-if="textOne" class="mt-[34px] w-1/2 whitespace-pre-line text-left font-sans text-base leading-4 text-current max-md:w-full">
        {{ textOne }}
      </p>
      <p v-if="textTwo" class="mt-14 w-1/2 whitespace-pre-line text-left font-sans text-base leading-4 text-current max-md:w-full">
        {{ textTwo }}
      </p>
    </div>
  </section>
</template>
