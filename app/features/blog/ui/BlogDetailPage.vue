<script setup lang="ts">
import type { BlogArticleDetailResponse, BlogArticleRelatedMaterial } from '@features/blog/model/blog.types'
import type { ArticleRowItem } from '@shared/types/article-row'
import BlogRelatedEntrepreneurCard from '@features/blog/ui/BlogRelatedEntrepreneurCard.vue'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import { formatRussianDate } from '@shared/lib/date'
import ArticleRowCard from '@shared/ui/cards/ArticleRowCard.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'

const props = defineProps<BlogArticleDetailResponse>()

const sectionOrder = computed(() => new Map(props.article.sectionOrder.map((key, index) => [key, index])))
const sectionStyle = (key: string) => ({ order: sectionOrder.value.get(key) ?? 99 })
const isVisible = (key: string) => props.article.sectionVisibility[key] !== false

const publishedDate = computed(() => formatRussianDate(props.article.publishedAt))
const relatedEntrepreneurs = computed(() => props.relatedMaterials.filter((item): item is BlogArticleRelatedMaterial & { type: 'entrepreneur' } => item.type === 'entrepreneur'))
const relatedCompanies = computed(() => props.relatedMaterials.filter((item): item is BlogArticleRelatedMaterial & { type: 'business' } => item.type === 'business'))
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
            <time v-if="publishedDate">{{ publishedDate }}</time>
            <span v-if="article.entrepreneur">Автор: {{ article.entrepreneur.name }}</span>
            <span v-if="article.category">{{ article.category }}</span>
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

    <section
      v-if="isVisible('related') && relatedMaterials.length"
      :style="sectionStyle('related')"
      class="bg-bg py-20 lg:py-32"
    >
      <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
        <h2 class="mb-12 text-center font-display text-[clamp(48px,8vw,96px)] font-black uppercase leading-none tracking-[-0.03em]">
          {{ article.relatedTitle || 'Материалы по теме' }}
        </h2>
        <div v-if="relatedEntrepreneurs.length" class="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-8">
          <BlogRelatedEntrepreneurCard
            v-for="item in relatedEntrepreneurs"
            :key="item.slug"
            :entrepreneur="{
              slug: item.slug,
              name: item.name,
              title: item.title || '',
              photo: item.coverImage,
              hoverPhoto: item.hoverPhoto,
            }"
          />
        </div>
        <div v-if="relatedCompanies.length" class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          <CompanyCatalogCard
            v-for="item in relatedCompanies"
            :key="item.slug"
            :company="{
              slug: item.slug,
              name: item.name,
              type: item.title || '',
              coverImage: item.coverImage,
            }"
          />
        </div>
      </div>
    </section>

    <section
      v-if="isVisible('latest') && latestRows.length"
      :style="sectionStyle('latest')"
      class="bg-bg py-20 lg:py-32"
    >
      <div class="mx-auto w-full max-w-[1920px] px-5 sm:px-6 lg:px-10">
        <h2 class="mb-12 font-display text-[clamp(48px,8vw,96px)] font-black uppercase leading-none tracking-[-0.03em]">
          Читать дальше
        </h2>
        <ul class="grid gap-5">
          <ArticleRowCard
            v-for="articleRow in latestRows"
            :key="articleRow.id"
            :article="articleRow"
          />
        </ul>
      </div>
    </section>

    <PageBannerSection
      v-if="isVisible('banner')"
      :style="sectionStyle('banner')"
      :desktop-image="bannerImage"
      :mobile-image="bannerMobileImage"
      :href="bannerLink"
    />
  </article>
</template>
