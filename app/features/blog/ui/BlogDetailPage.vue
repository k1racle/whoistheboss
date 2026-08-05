<script setup lang="ts">
import type { BlogArticleDetailResponse } from '@features/blog/model/blog.types'
import BlogArticleCard from '@features/blog/ui/BlogArticleCard.vue'
import CompanyCatalogCard from '@features/companies/ui/CompanyCatalogCard.vue'
import { formatRussianDate } from '@shared/lib/date'
import { isSectionVisible } from '@shared/lib/section-config'
import { ROUTES } from '@shared/navigation'
import EntrepreneurPosterCard from '@shared/ui/cards/EntrepreneurPosterCard.vue'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'
import PageBannerSection from '@shared/ui/page/PageBannerSection.vue'

const props = defineProps<BlogArticleDetailResponse>()

const orderedSections = computed(() =>
  props.article.sectionOrder.filter((key) => {
    if (!isSectionVisible(props.article.sectionVisibility, key)) {
      return false
    }

    if (key === 'secondary') {
      return Boolean(props.article.secondaryImage || props.article.secondaryText)
    }
    if (key === 'related') {
      return props.relatedMaterials.length > 0
    }
    if (key === 'latest') {
      return props.latestArticles.length > 0
    }
    if (key === 'banner') {
      return Boolean(props.bannerImage || props.bannerMobileImage)
    }

    return true
  }),
)
</script>

<template>
  <div class="flex flex-col">
    <template
      v-for="sectionKey in orderedSections"
      :key="sectionKey"
    >
      <section
        v-if="sectionKey === 'cover'"
        class="bg-text px-4 py-16 text-text-on-accent sm:px-6 lg:px-8 lg:py-24"
      >
        <div class="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <NuxtLink
            :to="ROUTES.BLOG"
            class="text-sm font-semibold text-text-on-accent/78 transition-colors hover:text-text-on-accent"
          >
            ← Все материалы
          </NuxtLink>

          <header class="space-y-5">
            <div class="flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.14em] text-text-on-accent/54 sm:text-sm">
              <span v-if="article.publishedAt">{{ formatRussianDate(article.publishedAt) }}</span>
              <span v-if="article.entrepreneur">• {{ article.entrepreneur.name }}</span>
              <span v-if="article.category">• {{ article.category }}</span>
            </div>

            <h1 class="font-display text-[clamp(3.2rem,10vw,7rem)] font-black uppercase leading-[0.86] tracking-[-0.05em]">
              {{ article.title }}
            </h1>

            <p
              v-if="article.subtitle"
              class="max-w-[52rem] text-lg leading-8 text-text-on-accent/78 sm:text-xl"
            >
              {{ article.subtitle }}
            </p>
          </header>

          <div
            v-if="article.coverImage"
            class="overflow-hidden rounded-[32px] shadow-[0_28px_80px_rgba(0,0,0,0.24)]"
          >
            <img
              :src="article.coverImage"
              :alt="article.title"
              class="h-full w-full object-cover"
            >
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'content'"
        class="bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto w-full max-w-4xl">
          <TrustedRichText
            :html="article.content"
            class="max-w-none text-lg leading-8 text-text/82
              [&_a]:text-accent [&_a]:underline-offset-4
              [&_a:hover]:underline
              [&_blockquote]:my-10 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6
              [&_blockquote]:text-2xl [&_blockquote]:leading-snug [&_blockquote]:italic
              [&_h2]:mt-14 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight
              [&_h3]:mt-10 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:tracking-tight
              [&_img]:my-10 [&_img]:w-full [&_img]:rounded-[28px]
              [&_li]:mb-3 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:font-semibold [&_ul]:my-6 [&_ul]:pl-6"
          />
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'secondary'"
        class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1fr)] lg:items-start">
          <div
            v-if="article.secondaryImage"
            class="overflow-hidden rounded-[28px] border border-black/10 bg-surface shadow-[0_24px_64px_rgba(7,7,7,0.06)]"
          >
            <img
              :src="article.secondaryImage"
              alt=""
              class="h-full w-full object-cover"
            >
          </div>

          <TrustedRichText
            v-if="article.secondaryText"
            :html="article.secondaryText"
            class="rounded-[28px] border border-black/10 bg-surface p-6 text-base leading-8 text-text/82 shadow-[0_24px_64px_rgba(7,7,7,0.06)] sm:p-8
              [&_a]:text-accent [&_a]:underline-offset-4
              [&_a:hover]:underline
              [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-5
              [&_blockquote]:text-xl [&_blockquote]:leading-8
              [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight
              [&_li]:mb-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:font-semibold [&_ul]:my-6 [&_ul]:pl-6"
          />
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'related'"
        class="bg-surface px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            {{ article.relatedTitle || 'Материалы по теме' }}
          </h2>

          <div class="grid gap-6 xl:grid-cols-3">
            <template
              v-for="item in relatedMaterials"
              :key="`${item.type}-${item.slug}`"
            >
              <EntrepreneurPosterCard
                v-if="item.type === 'entrepreneur'"
                :entrepreneur="{
                  slug: item.slug,
                  name: item.name,
                  title: item.title || '',
                  photo: item.coverImage,
                  hoverPhoto: item.hoverPhoto,
                }"
              />

              <CompanyCatalogCard
                v-else
                :company="{
                  slug: item.slug,
                  name: item.name,
                  type: item.title || '',
                  coverImage: item.coverImage,
                }"
              />
            </template>
          </div>
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'latest'"
        class="bg-[#f7f7f4] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-10">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            Читать дальше
          </h2>

          <div class="grid gap-6">
            <BlogArticleCard
              v-for="item in latestArticles"
              :key="item.id"
              :article="item"
            />
          </div>
        </div>
      </section>

      <PageBannerSection
        v-else-if="sectionKey === 'banner'"
        :desktop-image="bannerImage"
        :mobile-image="bannerMobileImage"
        :href="bannerLink"
        fallback-text="НОВЫЙ МАТЕРИАЛ\nУЖЕ В ПРОЕКТЕ"
      />
    </template>
  </div>
</template>
