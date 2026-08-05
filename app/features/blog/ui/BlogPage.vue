<script setup lang="ts">
import type { BlogPageData } from '@features/blog/model/blog.types'
import BlogArticleCard from '@features/blog/ui/BlogArticleCard.vue'
import BlogMainFeatureCard from '@features/blog/ui/BlogMainFeatureCard.vue'
import BlogRelatedSection from '@features/blog/ui/BlogRelatedSection.vue'
import ShootingLeadSection from '@features/shooting-request/ui/ShootingLeadSection.vue'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'

const props = defineProps<{
  page: BlogPageData
  success?: boolean
  error?: boolean
}>()

const heroLines = computed(() =>
  props.page.heroTitle
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
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
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <p class="text-sm font-medium uppercase tracking-[0.18em] text-text-on-accent/56">
            Блог проекта
          </p>

          <h1 class="font-display text-[clamp(4rem,14vw,10.6rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
            <span
              v-for="(line, index) in heroLines"
              :key="`${line}-${index}`"
              class="block"
            >
              {{ line }}
            </span>
          </h1>

          <div class="grid gap-4 border-t border-white/12 pt-6 text-base leading-7 text-text-on-accent/74 sm:grid-cols-2 sm:text-lg lg:max-w-[64rem]">
            <p>Новости проекта, колонки, материалы о бизнесе и истории людей, которые его создают.</p>
            <p>Раздел собран вокруг героев, компаний и контекста, который помогает понять, как всё устроено на практике.</p>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'popular'"
        class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <h2 class="font-display text-[clamp(3rem,8vw,5.6rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
            {{ page.popularTitle }}
          </h2>

          <div
            v-if="page.featuredArticles.length"
            class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <NuxtLink
              v-for="(article, index) in page.featuredArticles"
              :key="article.id"
              :to="ROUTES.ARTICLE(article.slug)"
              :class="[
                'group flex min-h-[280px] flex-col justify-between rounded-[28px] border border-black/10 p-6 shadow-[0_24px_64px_rgba(7,7,7,0.06)] transition-transform duration-300 hover:-translate-y-1',
                index === 2 || index === 3 ? 'bg-accent text-text-on-accent' : 'bg-surface text-text',
              ]"
            >
              <div class="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em]">
                <span>{{ article.entrepreneur?.name || 'Редакция проекта' }}</span>
              </div>

              <div class="space-y-3">
                <h3 class="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
                  {{ article.title }}
                </h3>
                <p
                  v-if="article.subtitle"
                  class="text-base leading-7 text-current/84"
                >
                  {{ article.subtitle }}
                </p>
              </div>

              <div class="inline-flex items-center gap-3 text-sm font-semibold">
                <span>Открыть</span>
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 17 17 7M9 7h8v8"
                  />
                </svg>
              </div>
            </NuxtLink>
          </div>

          <p
            v-else
            class="rounded-[28px] border border-black/10 bg-surface px-6 py-10 text-base leading-7 text-text/54"
          >
            Опубликованные материалы скоро появятся.
          </p>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'mainNews'"
        class="bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <BlogMainFeatureCard
            v-for="(card, index) in page.mainCards"
            :key="`${card.title}-${index}`"
            :card="card"
            :reverse="index % 2 === 1"
          />
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'latestNews'"
        class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              {{ page.latestTitle }}
            </h2>
            <p class="max-w-[38rem] text-base leading-7 text-text/72 sm:text-lg">
              {{ page.latestDescription }}
            </p>
          </div>

          <div
            v-if="page.latestArticles.length"
            class="grid gap-6"
          >
            <BlogArticleCard
              v-for="article in page.latestArticles"
              :key="article.id"
              :article="article"
            />
          </div>

          <p
            v-else
            class="rounded-[28px] border border-black/10 bg-surface px-6 py-10 text-base leading-7 text-text/54"
          >
            Публикации скоро появятся в ленте.
          </p>
        </div>
      </section>

      <BlogRelatedSection
        v-else-if="sectionKey === 'related' && (page.relatedEntrepreneurs.length || page.relatedCompanies.length)"
        :title="page.relatedTitle"
        :entrepreneurs="page.relatedEntrepreneurs"
        :companies="page.relatedCompanies"
      />

      <ShootingLeadSection
        v-else-if="sectionKey === 'cta'"
        :success="success"
        :error="error"
        :redirect-path="`${ROUTES.BLOG}?success=1`"
        title="Стать героем"
        description="Оставьте заявку, если хотите рассказать историю бизнеса, нового проекта или важного профессионального решения."
        headline="Готовы\nк разговору?"
      />
    </template>
  </div>
</template>
