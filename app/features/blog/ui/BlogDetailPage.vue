<script setup lang="ts">
import type { BlogArticleDetailResponse } from '@features/blog/model/blog.types'
import type { ArticleRowItem } from '@shared/types/article-row'
import BlogRelatedMaterialsSection from '@features/blog/ui/BlogRelatedMaterialsSection.vue'
import { formatNumericRussianDate } from '@shared/lib/date'
import ArticleRowsSection from '@shared/ui/articles/ArticleRowsSection.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'

const props = defineProps<BlogArticleDetailResponse>()

const sectionOrder = computed(() => new Map(props.article.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => props.article.sectionVisibility[key] !== false

const publishedDate = computed(() => formatNumericRussianDate(props.article.publishedAt))
const latestRows = computed<ArticleRowItem[]>(() => props.latestArticles.map(article => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  subtitle: article.subtitle,
  entrepreneurName: article.entrepreneur?.name ?? null,
  coverImage: article.coverImage,
})))
</script>

<template>
  <article class="flex flex-col overflow-hidden bg-bg text-text">
    <section
      v-if="isVisible('cover')"
      :style="sectionStyle('cover')"
      class="bg-bg pb-12 pt-24 lg:pb-20 lg:pt-36"
    >
      <div class="mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <header>
          <h1 class="font-display text-[clamp(56px,9vw,148px)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
            {{ article.title }}
          </h1>
          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm uppercase leading-5 text-text/70">
            <time v-if="publishedDate">Дата: {{ publishedDate }}</time>
            <span v-if="article.entrepreneur">Автор: {{ article.entrepreneur.name }}</span>
            <span
              v-if="article.category"
              class="inline-flex min-h-8 items-center bg-accent px-4 py-2 text-text-on-accent"
            >
              {{ article.category }}
            </span>
          </div>
        </header>

        <img
          v-if="article.coverImage"
          :src="article.coverImage"
          :alt="article.title"
          class="mt-10 aspect-[16/9] w-full bg-border-strong object-cover lg:mt-14"
        >
      </div>
    </section>

    <section
      v-if="isVisible('content')"
      :style="sectionStyle('content')"
      class="bg-bg py-12 lg:py-20"
    >
      <div class="mx-auto w-full max-w-[980px] px-5 sm:px-6 lg:px-10">
        <TrustedRichText
          :html="article.content"
          class="prose max-w-none font-sans text-lg leading-8 text-text"
        />
      </div>
    </section>

    <section
      v-if="isVisible('secondary') && (article.secondaryImage || article.secondaryText)"
      :style="sectionStyle('secondary')"
      class="bg-bg py-12 lg:py-20"
    >
      <div class="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:px-10">
        <img
          v-if="article.secondaryImage"
          :src="article.secondaryImage"
          alt=""
          class="aspect-[4/3] w-full bg-border-strong object-cover"
        >
        <TrustedRichText
          v-if="article.secondaryText"
          :html="article.secondaryText"
          class="prose max-w-none font-sans text-lg leading-8 text-text"
        />
      </div>
    </section>

    <BlogRelatedMaterialsSection
      v-if="isVisible('related') && relatedMaterials.length"
      :style="sectionStyle('related')"
      :title="article.relatedTitle"
      :materials="relatedMaterials"
    />

    <ArticleRowsSection
      v-if="isVisible('latest') && latestRows.length"
      :style="sectionStyle('latest')"
      title="Читать дальше"
      :articles="latestRows"
    />

    <PageBannerSection
      v-if="isVisible('banner')"
      :style="sectionStyle('banner')"
      :desktop-image="bannerImage"
      :mobile-image="bannerMobileImage"
      :href="bannerLink"
    />
  </article>
</template>
