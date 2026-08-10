<script setup lang="ts">
import type { BlogArticleDetailResponse } from '../model/blog.types'
import type { ArticleRowItem } from '@shared/types/article-row'
import BlogRelatedMaterialsSection from '@features/blog/ui/BlogRelatedMaterialsSection.vue'
import { formatNumericRussianDate } from '@shared/lib/date'
import ArticleRowsSection from '@shared/ui/articles/ArticleRowsSection.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import SectionTitle from '@shared/ui/page/SectionTitle.vue'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'
import { useSiteBanner } from '@shared/ui/page/useSiteBanner'

const props = defineProps<BlogArticleDetailResponse>()

const sectionOrder = computed(() => new Map(props.article.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => props.article.sectionVisibility[key] !== false

const publishedDate = computed(() => formatNumericRussianDate(props.article.publishedAt ?? props.article.createdAt))
const latestRows = computed<ArticleRowItem[]>(() => props.latestArticles.map(article => ({
  id: article.id,
  slug: article.slug,
  title: article.title,
  subtitle: article.subtitle,
  entrepreneurName: article.entrepreneur?.name ?? null,
  coverImage: article.coverImage,
})))
const { isEnabled: isBannerEnabled } = useSiteBanner()
</script>

<template>
  <article class="flex flex-col overflow-hidden bg-bg text-text">
    <section
      v-if="isVisible('cover')"
      :style="sectionStyle('cover')"
      class="bg-bg pt-24 lg:pt-36"
    >
      <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
        <header>
          <SectionTitle tag="h1">
            {{ article.title }}
          </SectionTitle>
          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm uppercase leading-5 text-text/70">
            <time v-if="publishedDate">Дата: {{ publishedDate }}</time>
            <span
              v-if="article.category"
              class="inline-flex min-h-8 items-center bg-accent px-4 py-2 text-text-on-accent"
            >
              {{ article.category }}
            </span>
          </div>
        </header>

        <figure
          v-if="article.coverImage"
          class="m-0 mt-10 lg:mt-14"
        >
          <img
            :src="article.coverImage"
            :alt="article.title"
            class="aspect-[16/9] w-full bg-border-strong object-cover"
          >
          <figcaption
            v-if="article.coverImageSource"
            class="font-sans text-[8px] font-normal uppercase leading-4 tracking-normal text-text"
          >
            Источник: {{ article.coverImageSource }}
          </figcaption>
        </figure>
      </div>
    </section>

    <section
      v-if="isVisible('content')"
      :style="sectionStyle('content')"
      class="bg-bg pb-12 pt-7 lg:pb-20 lg:pt-20"
    >
      <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
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
      <div class="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-8 px-5 sm:px-6 lg:grid-cols-2 lg:px-10">
        <figure
          v-if="article.secondaryImage"
          class="m-0"
        >
          <img
            :src="article.secondaryImage"
            alt=""
            class="aspect-[4/3] w-full bg-border-strong object-cover"
          >
          <figcaption
            v-if="article.secondaryImageSource"
            class="font-sans text-[8px] font-normal uppercase leading-4 tracking-normal text-text"
          >
            Источник: {{ article.secondaryImageSource }}
          </figcaption>
        </figure>
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
      v-if="isVisible('banner') && isBannerEnabled('/blog/SLUG')"
      :style="sectionStyle('banner')"
      :desktop-image="bannerImage"
      :mobile-image="bannerMobileImage"
      :href="bannerLink"
    />
  </article>
</template>
