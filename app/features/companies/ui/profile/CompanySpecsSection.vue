<script setup lang="ts">
import type { CompanySpecItem } from '@features/companies/model/companies-page.types'
import ArrowMark from '@shared/ui/icons/ArrowMark.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'

defineProps<{
  title: string
  description: string
  items: CompanySpecItem[]
}>()
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto w-full max-w-[1920px]">
      <SectionTitle class="m-0 whitespace-pre-line">
        {{ title }}
      </SectionTitle>
      <p class="mt-3 whitespace-pre-line font-sans text-base uppercase leading-4 text-text">
        {{ description }}
      </p>

      <div class="mt-8 grid gap-2.5">
        <article
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          class="group flex min-h-[100px] items-center justify-between gap-6 border border-accent bg-accent px-5 py-4 text-text-on-accent transition-colors duration-200 hover:border-text hover:bg-surface hover:text-text lg:px-7"
        >
          <div class="flex min-w-0 items-center gap-5">
            <img
              v-if="item.icon"
              :src="item.icon"
              alt=""
              class="h-8 w-12 shrink-0 object-contain"
            >
            <span class="min-w-0">
              <strong class="block whitespace-pre-line font-sans text-[20px] font-bold uppercase leading-[21px] lg:text-[25px] lg:leading-[25px]">
                {{ item.title }}
              </strong>
              <small v-if="item.note" class="mt-1 block whitespace-pre-line font-sans text-xs uppercase leading-3">
                {{ item.note }}
              </small>
            </span>
          </div>

          <ArrowMark class="h-8 w-12 shrink-0" />
        </article>
      </div>
    </div>
  </section>
</template>
