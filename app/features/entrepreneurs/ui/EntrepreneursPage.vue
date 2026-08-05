<script setup lang="ts">
import type { EntrepreneursPageData } from '@features/entrepreneurs/model/entrepreneur.types'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import EntrepreneurPosterCard from '@shared/ui/cards/EntrepreneurPosterCard.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<{
  page: EntrepreneursPageData
  success?: boolean
  error?: boolean
}>()

const heroLines = computed(() =>
  props.page.heroTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
)

const orderedSections = computed(() =>
  props.page.sectionOrder.filter((key) => isSectionVisible(props.page.sectionVisibility, key))
)
</script>

<template>
  <div class="flex flex-col">
    <template
      v-for="sectionKey in orderedSections"
      :key="sectionKey"
    >
      <section
        v-if="sectionKey === 'hero'"
        class="bg-text px-4 py-14 text-text-on-accent sm:px-6 lg:px-10 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-10">
          <div class="max-w-[78rem]">
            <p class="font-sans text-sm uppercase leading-4 text-text-on-accent/72 sm:text-base">
              Предприниматели проекта
            </p>
            <h1 class="mt-5 font-display text-[clamp(4rem,14vw,10.5rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
              <span
                v-for="(line, index) in heroLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h1>
          </div>

          <div class="grid gap-4 border-t border-white/15 pt-6 font-sans text-sm leading-6 text-text-on-accent/78 sm:grid-cols-2 sm:text-base lg:max-w-[68rem]">
            <p>Здесь собраны истории людей, которые строят компании, принимают решения и задают темп развитию своих проектов.</p>
            <p>Через их опыт можно увидеть не только биографию, но и подход к делу, масштабу, риску и росту.</p>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'audience'"
        class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              {{ page.audienceTitle }}
            </h2>
            <p class="max-w-[42rem] font-sans text-base leading-7 text-text/76 sm:text-lg whitespace-pre-line">
              {{ page.audienceText }}
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="card in page.audienceCards"
              :key="card.id"
              class="group relative min-h-[220px] overflow-hidden border border-border-strong bg-surface p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
            >
              <div class="space-y-4 transition-opacity duration-300 group-hover:opacity-0">
                <p class="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text">
                  {{ card.title }}
                </p>
                <p
                  v-if="card.description"
                  class="font-sans text-base leading-7 text-text/70"
                >
                  {{ card.description }}
                </p>
              </div>

              <div class="absolute inset-0 flex flex-col justify-between bg-accent p-5 text-text-on-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-6">
                <p class="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-black uppercase leading-[0.94] tracking-[-0.03em]">
                  {{ card.hoverTitle || card.title }}
                </p>
                <p class="font-sans text-base leading-7 text-text-on-accent/84">
                  {{ card.hoverDescription || card.description || 'Герои, за которыми интересно наблюдать в развитии.' }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'heroes'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              {{ page.heroesTitle }}
            </h2>
            <p class="max-w-[40rem] font-sans text-base leading-7 text-text/76 sm:text-lg whitespace-pre-line">
              {{ page.heroesText }}
            </p>
          </div>

          <div class="grid gap-5 xl:grid-cols-3">
            <EntrepreneurPosterCard
              v-for="entrepreneur in page.entrepreneurs"
              :key="entrepreneur.slug"
              :entrepreneur="entrepreneur"
            />
          </div>
        </div>
      </section>

      <ShootingLeadSection
        v-else-if="sectionKey === 'cta'"
        :success="success"
        :error="error"
        :redirect-path="`${ROUTES.ENTREPRENEURS}?success=1`"
        title="Стать героем"
        description="Если вы хотите стать участником проекта и рассказать историю своего дела, оставьте короткую заявку."
        headline="Пора рассказать&#10;свою историю?"
      />

      <PageBannerSection
        v-else-if="sectionKey === 'banner'"
        :desktop-image="page.bannerImage"
        :mobile-image="page.bannerMobileImage"
        :href="page.bannerLink"
        fallback-text="Новый герой&#10;уже в проекте"
      />
    </template>
  </div>
</template>
