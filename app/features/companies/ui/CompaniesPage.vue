<script setup lang="ts">
import type { CompaniesPageData } from '@features/companies/model/companies-page.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<{
  page: CompaniesPageData
  success?: boolean
  error?: boolean
}>()

const aboutParagraphs = computed(() =>
  props.page.aboutText.split(/\n\s*\n/).filter(Boolean),
)

const orderedSections = computed(() =>
  props.page.sectionOrder.filter((key) => isSectionVisible(props.page.sectionVisibility, key)),
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
        class="bg-text px-4 py-16 text-text-on-accent sm:px-6 lg:px-8 lg:py-24"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <p class="text-sm font-medium uppercase tracking-[0.18em] text-text-on-accent/56">
            Главные компании проекта
          </p>
          <h1 class="font-display text-[clamp(4rem,14vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.05em] whitespace-pre-line">
            {{ page.heroTitle }}
          </h1>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'about'"
        class="bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,5.6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            {{ page.aboutTitle }}
          </h2>

          <div class="grid gap-5 text-base leading-8 text-text/78 sm:text-lg">
            <p
              v-for="paragraph in aboutParagraphs"
              :key="paragraph"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'catalog'"
        class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,5.8rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              Компании
            </h2>
            <p class="max-w-[36rem] text-base leading-7 text-text/72 sm:text-lg">
              Бизнесы, проекты и места, за которыми стоят герои «Кто здесь главный?».
            </p>
          </div>

          <div
            v-if="page.companies.length"
            class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <CompanyCatalogCard
              v-for="company in page.companies"
              :key="company.slug"
              :company="company"
            />
          </div>

          <p
            v-else
            class="rounded-[28px] border border-black/10 bg-surface px-6 py-10 text-base leading-7 text-text/54"
          >
            Компании скоро появятся.
          </p>
        </div>
      </section>

      <ShootingLeadSection
        v-else-if="sectionKey === 'cta'"
        :success="success"
        :error="error"
        :redirect-path="`${ROUTES.COMPANIES}?success=1`"
        title="Стать героем"
        description="Оставьте заявку, если хотите рассказать о своём проекте и стать частью медиапортала."
        headline="Готовы\nк обсуждению\nпроекта?"
      />

      <PageBannerSection
        v-else-if="sectionKey === 'banner'"
        :desktop-image="page.bannerImage"
        :mobile-image="page.bannerMobileImage"
        :href="page.bannerLink || ROUTES.ENTREPRENEURS"
        fallback-text="ЗДЕСЬ БУДЕТ БАННЕР\nО НОВОМ ВЫПУСКЕ"
      />
    </template>
  </div>
</template>
