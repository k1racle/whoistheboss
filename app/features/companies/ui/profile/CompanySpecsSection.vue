<script setup lang="ts">
import type { CompanySpecItem } from '@features/companies/model/companies-page.types'
import { protectPrepositions } from '@shared/lib/typography'
import AutoFitText from '@shared/ui/text/AutoFitText.vue'

const props = defineProps<{
  title: string
  description: string
  items: CompanySpecItem[]
}>()

const singleLineTitle = computed(() => protectPrepositions(props.title.replace(/\s+/g, ' ').trim()))
const protectedDescription = computed(() => protectPrepositions(props.description))
</script>

<template>
  <section class="bg-bg px-5 py-[90px] sm:px-6 lg:px-10 lg:py-[130px]">
    <div class="mx-auto w-full max-w-[1920px]">
      <AutoFitText
        as="h2"
        :text="singleLineTitle"
        :min-font-size="24"
        class="m-0 block w-full max-w-full whitespace-nowrap font-display text-[42px] font-black uppercase leading-[0.88] tracking-[-0.03em] text-text sm:text-[clamp(3rem,8vw,6rem)]"
      >
        {{ singleLineTitle }}
      </AutoFitText>
      <p class="mt-3 whitespace-pre-line font-sans text-base uppercase leading-4 text-text">
        {{ protectedDescription }}
      </p>

      <div class="mt-8 grid gap-2.5">
        <article
          v-for="(item, index) in items"
          :key="`${item.title}-${index}`"
          class="group flex min-h-[100px] min-w-0 items-center gap-6 overflow-hidden border border-accent bg-accent px-5 py-4 text-text-on-accent transition-colors duration-200 hover:border-text hover:bg-surface hover:text-text lg:px-7"
        >
          <div class="flex min-w-0 flex-1 items-center gap-5">
            <img
              v-if="item.icon"
              :src="item.icon"
              alt=""
              class="h-8 w-12 shrink-0 object-contain"
            >
            <span class="min-w-0">
              <strong class="block min-w-0 max-w-full whitespace-pre-line font-sans text-[20px] font-bold uppercase leading-[21px] [overflow-wrap:anywhere] hyphens-auto lg:text-[25px] lg:leading-[25px]">
                {{ protectPrepositions(item.title) }}
              </strong>
              <small v-if="item.note" class="mt-1 block min-w-0 max-w-full whitespace-pre-line font-sans text-xs uppercase leading-3 [overflow-wrap:anywhere] hyphens-auto">
                {{ protectPrepositions(item.note) }}
              </small>
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
