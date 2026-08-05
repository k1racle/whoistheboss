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
              Блог проекта
            </p>
            <h1 class="mt-5 font-display text-[clamp(4rem,14vw,11rem)] font-black uppercase leading-[0.82] tracking-[-0.05em]">
              <span
                v-for="(line, index) in heroLines"
                :key="`${line}-${index}`"
                class="block"
              >
                {{ line }}
              </span>
            </h1>
          </div>

          <div class="grid gap-4 border-t border-white/15 pt-6 font-sans text-sm leading-6 text-text-on-accent/78 sm:grid-cols-2 sm:text-base lg:max-w-[64rem]">
            <p>Новости проекта, колонки, материалы о бизнесе и истории людей, которые его создают.</p>
            <p>Раздел собран вокруг героев, компаний и контекста, который помогает понять, как все устроено на практике.</p>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'popular'"
        class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-text">
            {{ page.popularTitle }}
          </h2>

          <div
            v-if="page.featuredArticles.length"
            class="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            <NuxtLink
              v-for="(article, index) in page.featuredArticles"
              :key="article.id"
              :to="ROUTES.ARTICLE(article.slug)"
              :class="[
                'group flex min-h-[260px] flex-col justify-between border border-border-strong p-5 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[300px] sm:p-6',
                index === 2 || index === 3 ? 'bg-accent text-text-on-accent' : 'bg-surface text-text',
              ]"
            >
              <div class="inline-flex items-center gap-3 font-sans text-xs uppercase leading-4 sm:text-sm">
                <span>{{ article.entrepreneur?.name || 'Редакция проекта' }}</span>
                <span aria-hidden="true">[ ↗ ]</span>
              </div>

              <div class="space-y-3">
                <h3 class="font-display text-[clamp(2rem,5vw,3.6rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
                  {{ article.title }}
                </h3>
                <p
                  v-if="article.subtitle"
                  class="font-sans text-base leading-7 opacity-84"
                >
                  {{ article.subtitle }}
                </p>
              </div>
            </NuxtLink>
          </div>

          <p
            v-else
            class="border border-border-strong bg-surface px-5 py-6 font-sans text-base leading-7 text-text/80 sm:px-6"
          >
            Опубликованные материалы скоро появятся.
          </p>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'mainNews'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-6">
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
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-end">
            <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
              {{ page.latestTitle }}
            </h2>
            <p class="max-w-[38rem] font-sans text-base leading-7 text-text/76 sm:text-lg">
              {{ page.latestDescription }}
            </p>
          </div>

          <div
            v-if="page.latestArticles.length"
            class="grid gap-5"
          >
            <BlogArticleCard
              v-for="article in page.latestArticles"
              :key="article.id"
              :article="article"
            />
          </div>

          <p
            v-else
            class="border border-border-strong bg-surface px-5 py-6 font-sans text-base leading-7 text-text/80 sm:px-6"
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
        headline="Готовы&#10;к разговору?"
      />
    </template>
  </div>
</template>
