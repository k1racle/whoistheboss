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
    if (!isSectionVisible(props.article.sectionVisibility, key)) return false

    if (key === 'secondary') return Boolean(props.article.secondaryImage || props.article.secondaryText)
    if (key === 'related') return props.relatedMaterials.length > 0
    if (key === 'latest') return props.latestArticles.length > 0
    if (key === 'banner') return Boolean(props.bannerImage || props.bannerMobileImage)

    return true
  })
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
        class="bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1180px] flex-col gap-8">
          <NuxtLink
            :to="ROUTES.BLOG"
            class="font-sans text-sm uppercase leading-4 text-accent transition-colors hover:text-text sm:text-base"
          >
            ← Все материалы
          </NuxtLink>

          <header class="space-y-5">
            <div class="flex flex-wrap gap-x-4 gap-y-2 font-sans text-xs uppercase leading-4 text-text-muted sm:text-sm">
              <span v-if="article.publishedAt">{{ formatRussianDate(article.publishedAt) }}</span>
              <span v-if="article.entrepreneur">{{ article.entrepreneur.name }}</span>
              <span v-if="article.category">{{ article.category }}</span>
            </div>

            <h1 class="font-display text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-text">
              {{ article.title }}
            </h1>

            <p
              v-if="article.subtitle"
              class="max-w-[52rem] font-sans text-lg leading-8 text-text/82 sm:text-xl"
            >
              {{ article.subtitle }}
            </p>
          </header>

          <div
            v-if="article.coverImage"
            class="overflow-hidden border border-border-strong"
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
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto w-full max-w-[980px]">
          <TrustedRichText
            :html="article.content"
            class="max-w-none font-sans text-base leading-8 text-text/84
              [&_a]:text-accent [&_a]:underline-offset-4
              [&_a:hover]:underline
              [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-5
              [&_blockquote]:text-xl [&_blockquote]:leading-8
              [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[clamp(2rem,6vw,4rem)] [&_h2]:font-black [&_h2]:uppercase [&_h2]:leading-[0.92] [&_h2]:tracking-[-0.03em]
              [&_h3]:mt-10 [&_h3]:font-display [&_h3]:text-[clamp(1.75rem,4vw,3rem)] [&_h3]:font-black [&_h3]:uppercase [&_h3]:leading-[0.94]
              [&_img]:my-8 [&_img]:w-full [&_img]:border [&_img]:border-border-strong
              [&_li]:mb-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:text-text [&_ul]:my-6 [&_ul]:pl-6"
          />
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'secondary'"
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto grid w-full max-w-[1180px] gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1fr)] lg:items-start">
          <div
            v-if="article.secondaryImage"
            class="overflow-hidden border border-border-strong bg-surface"
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
            class="max-w-none font-sans text-base leading-8 text-text/84
              [&_a]:text-accent [&_a]:underline-offset-4
              [&_a:hover]:underline
              [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-5
              [&_blockquote]:text-xl [&_blockquote]:leading-8
              [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[clamp(2rem,5vw,3.4rem)] [&_h2]:font-black [&_h2]:uppercase [&_h2]:leading-[0.94]
              [&_li]:mb-2 [&_ol]:my-6 [&_ol]:pl-6 [&_p]:mb-6 [&_strong]:text-text [&_ul]:my-6 [&_ul]:pl-6"
          />
        </div>
      </section>

      <section
        v-else-if="sectionKey === 'related'"
        class="border-t border-border-strong bg-surface px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            {{ article.relatedTitle || 'Материалы по теме' }}
          </h2>

          <div class="grid gap-5 xl:grid-cols-3">
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
        class="border-t border-border-strong bg-bg px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
      >
        <div class="mx-auto flex w-full max-w-[1920px] flex-col gap-8">
          <h2 class="font-display text-[clamp(3rem,8vw,6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] text-text">
            Читать дальше
          </h2>

          <div class="grid gap-5">
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
        fallback-text="Новый материал&#10;уже в проекте"
      />
    </template>
  </div>
</template>
