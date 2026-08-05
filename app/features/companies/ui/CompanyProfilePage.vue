<script setup lang="ts">
import type { CompanyProfileData } from '@features/companies/model/companies-page.types'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<{
  company: CompanyProfileData
  success?: boolean
  error?: boolean
}>()

const orderedSections = computed(() =>
  props.company.sectionOrder.filter((key) => {
    if (!isSectionVisible(props.company.sectionVisibility, key, key === 'awards' ? props.company.awardsEnabled : true)) {
      return false
    }

    if (key === 'founder' || key === 'ownerBiography') return Boolean(props.company.owner)
    if (key === 'addresses') {
      return Boolean(
        props.company.address
        || props.company.city
        || props.company.phone
        || props.company.email
        || props.company.website
        || props.company.mapSrc,
      )
    }
    if (key === 'awards') return props.company.awardsEnabled && props.company.awards.length > 0
    if (key === 'gallery') return props.company.galleryImages.length > 0
    if (key === 'related') return props.company.related.length > 0
    if (key === 'banner') return Boolean(props.company.bannerImage || props.company.bannerMobileImage)

    return true
  })
)

const aboutTitleLines = computed(() =>
  props.company.aboutTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
)

const factsTitleLines = computed(() =>
  props.company.factsTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
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
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <NuxtLink
            :to="ROUTES.COMPANIES"
            class="font-sans text-sm uppercase leading-4 text-text-on-accent/72 transition-colors hover:text-text-on-accent sm:text-base"
          >
            ← Все компании
          </NuxtLink>

          <div class="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
            <div>
              <p class="font-sans text-sm uppercase leading-4 text-text-on-accent/72 sm:text-base">
                {{ company.type }}
              </p>
              <h1 class="mt-5 font-display text-[clamp(3.6rem,12vw,9.5rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
                <span class="block">{{ company.heroTitleTop }}</span>
                <span
                  v-if="company.heroTitleBottom"
                  class="block"
                >
                  {{ company.heroTitleBottom }}
                </span>
              </h1>
            </div>

            <div class="space-y-5 border-l border-white/15 pl-0 xl:pl-8">
              <p class="font-sans text-xl leading-8 text-text-on-accent/88">
                {{ company.heroTeaser }}
              </p>
              <p
                v-if="company.description"
                class="font-sans text-base leading-7 text-text-on-accent/72"
              >
                {{ company.description }}
              </p>
            </div>
          </div>

          <div class="overflow-hidden border-t border-white/15 pt-6">
            <div class="flex min-w-max gap-5 font-sans text-sm uppercase leading-4 text-text-on-accent/60 sm:text-base">
              <span
                v-for="index in 6"
                :key="index"
              >
                {{ company.heroMarquee }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'manifest'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <div
            class="relative overflow-hidden border border-border-strong bg-bg min-h-[360px]"
            :style="company.manifestBackgroundImage ? `background-image:url(${company.manifestBackgroundImage});background-size:cover;background-position:center;` : undefined"
          >
            <img
              v-if="company.manifestSquareImage"
              :src="company.manifestSquareImage"
              :alt="company.name"
              class="absolute bottom-5 right-5 h-[min(48vw,320px)] w-[min(48vw,320px)] object-cover shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:bottom-8 sm:right-8"
            >
          </div>

          <div class="flex flex-col justify-between gap-8 border border-border-strong bg-bg p-6 sm:p-8 lg:p-10">
            <h2 class="font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
              {{ company.manifestTitle }}
            </h2>

            <p class="font-sans text-lg leading-8 text-text/84">
              {{ company.manifestTextOne }}
            </p>

            <div class="grid gap-5 border-t border-border-strong pt-6 font-sans text-base leading-7 text-text/76 lg:grid-cols-2">
              <p>{{ company.manifestTextTwo }}</p>
              <p>{{ company.manifestTextThree }}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'titleBand'"
        class="bg-accent px-4 py-8 text-text-on-accent sm:px-6 lg:px-10 lg:py-10"
      >
        <div class="mx-auto w-full max-w-[1920px]">
          <p class="font-display text-[clamp(2.6rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
            О компании
          </p>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'about'"
        class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <div class="space-y-6">
            <h2 class="font-display text-[clamp(2.8rem,7vw,5.8rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
              <span
                v-for="(line, index) in aboutTitleLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>

            <p class="max-w-[56rem] font-sans text-lg leading-8 text-text/82 whitespace-pre-line">
              {{ company.aboutText }}
            </p>

            <p class="max-w-[34rem] border-l-4 border-accent pl-5 font-sans text-base leading-7 text-text/72 whitespace-pre-line">
              {{ company.aboutAsideText }}
            </p>
          </div>

          <div
            v-if="company.aboutPhoto"
            class="overflow-hidden border border-border-strong bg-surface"
          >
            <img
              :src="company.aboutPhoto"
              :alt="company.name"
              class="h-full w-full object-cover"
            >
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'founder' && company.owner"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-center">
          <div
            v-if="company.founderPhoto"
            class="overflow-hidden border border-border-strong bg-bg"
          >
            <img
              :src="company.founderPhoto"
              :alt="company.owner.name"
              class="h-full w-full object-cover"
            >
          </div>

          <div class="space-y-5">
            <p class="font-sans text-sm uppercase leading-4 text-text-muted sm:text-base">
              Основатель
            </p>
            <h2 class="font-display text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-text">
              {{ company.owner.name }}
            </h2>
            <p class="font-sans text-lg leading-8 text-text/84">
              {{ company.owner.title }}
            </p>
            <blockquote
              v-if="company.owner.quote"
              class="border-l-4 border-accent pl-5 font-sans text-xl leading-8 text-text sm:text-2xl"
            >
              «{{ company.owner.quote }}»
            </blockquote>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'ownerBiography' && company.owner"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div class="space-y-5">
            <h2 class="font-display text-[clamp(2.8rem,7vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
              Биография
            </h2>
            <NuxtLink
              :to="ROUTES.ENTREPRENEUR(company.owner.slug)"
              class="inline-flex items-center gap-3 border border-border-strong px-4 py-3 font-sans text-sm uppercase leading-4 text-accent transition-colors hover:border-accent sm:text-base"
            >
              <span>Профиль героя</span>
              <span aria-hidden="true">[ ↗ ]</span>
            </NuxtLink>
            <div
              v-if="company.owner.biographyPhoto"
              class="overflow-hidden border border-border-strong bg-surface"
            >
              <img
                :src="company.owner.biographyPhoto"
                :alt="company.owner.name"
                class="h-full w-full object-cover"
              >
            </div>
          </div>

          <div class="grid gap-5 xl:grid-cols-2">
            <article
              v-for="(block, index) in company.owner.biographyBlocks"
              :key="`${index}-${block.slice(0, 24)}`"
              class="border border-border-strong bg-surface p-5 font-sans text-base leading-7 text-text/82 sm:p-6"
            >
              {{ block }}
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'specs'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              {{ company.specsTitle }}
            </h2>
            <p class="max-w-[38rem] font-sans text-base leading-7 text-text/76 sm:text-lg">
              {{ company.specsDescription }}
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="item in company.specsItems"
              :key="`${item.title}-${item.note}`"
              class="flex h-full flex-col justify-between gap-6 border border-border-strong bg-bg p-5 sm:p-6"
            >
              <div class="space-y-4">
                <img
                  v-if="item.icon"
                  :src="item.icon"
                  alt=""
                  class="h-10 w-10 object-contain"
                >
                <h3 class="font-display text-[clamp(1.9rem,4vw,3rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text">
                  {{ item.title }}
                </h3>
              </div>
              <p
                v-if="item.note"
                class="font-sans text-base leading-7 text-text/72"
              >
                {{ item.note }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'addresses'"
        class="border-t border-border-strong bg-bg px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.92fr_1fr]">
          <div class="rounded-[30px] border border-black/10 bg-surface p-6 shadow-[0_24px_64px_rgba(7,7,7,0.06)] sm:p-8">
            <h2 class="font-display text-[clamp(2.4rem,6vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-text">
              Адреса и контакты
            </h2>

            <div class="mt-8 grid gap-5">
              <div
                v-if="company.address || company.city"
                class="grid gap-1"
              >
                <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Адрес</p>
                <p class="font-sans text-base leading-7 text-text sm:text-lg whitespace-pre-line">
                  {{ [company.city, company.address].filter(Boolean).join(', ') }}
                </p>
              </div>

              <div
                v-if="company.phone"
                class="grid gap-1"
              >
                <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Телефон</p>
                <a
                  :href="`tel:${company.phone.replace(/\s+/g, '')}`"
                  class="font-sans text-base leading-7 text-text transition-colors hover:text-accent sm:text-lg"
                >
                  {{ company.phone }}
                </a>
              </div>

              <div
                v-if="company.email"
                class="grid gap-1"
              >
                <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Email</p>
                <a
                  :href="`mailto:${company.email}`"
                  class="font-sans text-base leading-7 text-text transition-colors hover:text-accent sm:text-lg"
                >
                  {{ company.email }}
                </a>
              </div>

              <div
                v-if="company.website"
                class="grid gap-1"
              >
                <p class="font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">Сайт</p>
                <a
                  :href="company.website"
                  target="_blank"
                  rel="noopener"
                  class="font-sans text-base leading-7 text-text transition-colors hover:text-accent sm:text-lg"
                >
                  {{ company.website }}
                </a>
              </div>
            </div>
          </div>

          <div
            v-if="company.mapSrc"
            class="min-h-[320px] overflow-hidden rounded-[30px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)]"
          >
            <iframe
              :src="company.mapSrc"
              :title="`Карта ${company.name}`"
              class="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>

          <div
            v-else
            class="flex min-h-[320px] items-center justify-center rounded-[30px] border border-black/10 bg-surface p-8 text-center shadow-[0_24px_64px_rgba(7,7,7,0.06)]"
          >
            <p class="max-w-[24rem] font-sans text-base leading-7 text-text-muted sm:text-lg">
              Интерактивная карта для этой компании пока не добавлена.
            </p>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'awards'"
        class="border-t border-border-strong bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              {{ company.awardsTitle }}
            </h2>
            <p class="max-w-[38rem] font-sans text-base leading-7 text-text/76 sm:text-lg">
              {{ company.awardsDescription }}
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="award in company.awards"
              :key="`${award.nominations}-${award.place}`"
              class="flex h-full flex-col justify-between gap-6 border border-border-strong bg-bg p-5 sm:p-6"
            >
              <div class="flex items-start justify-between gap-4">
                <p class="font-sans text-sm uppercase leading-6 text-text/78 whitespace-pre-line sm:text-base">
                  {{ award.nominations }}
                </p>
                <img
                  v-if="award.icon"
                  :src="award.icon"
                  alt=""
                  class="h-12 w-12 object-contain"
                >
              </div>
              <p class="font-display text-[clamp(2rem,5vw,3.6rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-accent whitespace-pre-line">
                {{ award.place }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'facts'"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-8 xl:grid-cols-[0.94fr_1fr]">
          <div class="space-y-5">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              <span
                v-for="(line, index) in factsTitleLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h2>
            <p class="max-w-[34rem] font-sans text-base leading-7 text-text/72 sm:text-lg">
              {{ company.factsSubtitle }}
            </p>
            <div
              v-if="company.factsPhoto"
              class="overflow-hidden border border-border-strong bg-surface"
            >
              <img
                :src="company.factsPhoto"
                alt=""
                class="h-full w-full object-cover"
              >
            </div>
          </div>

          <div class="grid gap-5">
            <article class="border border-border-strong bg-surface p-5 font-sans text-base leading-7 text-text/82 sm:p-6 sm:text-lg">
              {{ company.factsTextOne }}
            </article>
            <article class="border border-border-strong bg-surface p-5 font-sans text-base leading-7 text-text/82 sm:p-6 sm:text-lg">
              {{ company.factsTextTwo }}
            </article>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'gallery'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            Галерея
          </h2>

          <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <figure
              v-for="(image, index) in company.galleryImages"
              :key="`${image}-${index}`"
              class="overflow-hidden border border-border-strong bg-bg"
            >
              <img
                :src="image"
                :alt="`${company.name} — фото ${index + 1}`"
                class="h-full w-full object-cover"
              >
            </figure>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'more'"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1920px] gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div class="grid gap-5 sm:grid-cols-2">
            <component
              :is="item.href ? 'a' : 'div'"
              v-for="(item, index) in company.moreItems"
              :key="`${item.title}-${index}`"
              :href="item.href || undefined"
              class="group flex min-h-[190px] flex-col justify-between border border-border-strong bg-surface p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6"
            >
              <div class="inline-flex items-center gap-3 font-sans text-sm uppercase leading-4 text-accent">
                <span>{{ item.href ? 'Открыть' : 'Скоро' }}</span>
                <span aria-hidden="true">[ ↗ ]</span>
              </div>
              <h3 class="font-display text-[clamp(2rem,5vw,3.2rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] text-text whitespace-pre-line">
                {{ item.title }}
              </h3>
            </component>
          </div>

          <div
            v-if="company.morePhoto"
            class="overflow-hidden border border-border-strong bg-surface"
          >
            <img
              :src="company.morePhoto"
              :alt="company.name"
              class="h-full w-full object-cover"
            >
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'related'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            {{ company.relatedTitle }}
          </h2>

          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <CompanyCatalogCard
              v-for="item in company.related"
              :key="item.slug"
              :company="item"
            />
          </div>
        </div>
      </section>

      <ShootingLeadSection
        v-else-if="sectionKey === 'cta'"
        :success="success"
        :error="error"
        :redirect-path="`${ROUTES.COMPANY(company.slug)}?success=1`"
        title="Стать героем"
        description="Если вы хотите рассказать о своем деле, оставьте заявку, и мы обсудим формат участия в проекте."
        headline="Есть история&#10;для проекта?"
      />

      <PageBannerSection
        v-else-if="sectionKey === 'banner'"
        :desktop-image="company.bannerImage"
        :mobile-image="company.bannerMobileImage"
        :href="company.bannerLink"
        fallback-text="Следующий&#10;материал уже&#10;в проекте"
      />
    </template>
  </div>
</template>
