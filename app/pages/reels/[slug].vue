<script setup lang="ts">
import type { ReelItem } from '@features/reels/model/reel.types'
import { ROUTES } from '@shared/navigation'
import { buildReelSeoDescription, buildReelSeoTitle } from '@shared/seo/content'
import { useManagedSeo } from '@shared/seo/use-managed-seo'
import VideoFrame from '@shared/ui/media/VideoFrame.vue'
import TrustedRichText from '@shared/ui/page/TrustedRichText.vue'

const route = useRoute()
const slug = String(route.params.slug)
const city = typeof route.params.city === 'string' ? route.params.city : undefined

const { data, error } = await useAsyncData(`reel-${city || 'all'}-${slug}`, async () =>
  await $fetch<ReelItem>(`/api/reels/${slug}`, { query: { city } }))

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Reel not found' })
}

const reel = data.value
const title = buildReelSeoTitle(reel)
const description = buildReelSeoDescription(reel)
const seo = useManagedSeo({
  title,
  description,
  image: reel.socialImage || reel.coverImage,
  type: 'video.other',
})

useSchemaOrg([
  defineVideo({
    name: reel.title,
    description: seo.description,
    thumbnailUrl: seo.imageUrl,
    uploadDate: reel.createdAt,
    url: seo.canonicalUrl,
    embedUrl: reel.videoType === 'EMBED' ? reel.videoUrl || undefined : undefined,
    contentUrl: reel.videoType === 'SELF_HOSTED' ? reel.videoFile || undefined : undefined,
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Главная', item: '/' },
      { name: 'Рилсы', item: ROUTES.REELS },
      { name: reel.title },
    ],
  }),
])
</script>

<template>
  <article class="bg-bg px-5 pb-20 pt-28 text-text sm:px-6 lg:px-10 lg:pb-28 lg:pt-36">
    <div class="mx-auto w-full max-w-[1200px]">
      <NuxtLink :to="ROUTES.REELS" class="font-sans text-sm uppercase text-text/60 hover:text-accent">
        ← Все рилсы
      </NuxtLink>
      <h1 class="mt-8 max-w-[1100px] text-balance font-display text-[42px] font-black uppercase leading-[0.88] tracking-[-0.03em] text-accent sm:text-[clamp(64px,10vw,144px)]">
        {{ reel.title }}
      </h1>
      <p v-if="reel.entrepreneur" class="mt-6 font-sans text-sm font-bold uppercase text-text/60">
        {{ reel.entrepreneur.name }}<span v-if="reel.entrepreneur.title"> — {{ reel.entrepreneur.title }}</span>
      </p>
      <div class="mx-auto mt-10 w-full max-w-[520px] lg:mt-14">
        <VideoFrame
          :title="reel.title"
          :video-type="reel.videoType"
          :video-url="reel.videoUrl"
          :video-file="reel.videoFile"
          :poster="reel.coverImage"
          aspect-class="aspect-[9/16]"
        />
      </div>
      <TrustedRichText
        v-if="reel.description"
        :html="reel.description"
        class="prose mx-auto mt-10 max-w-[760px] font-sans text-lg leading-8 text-text"
      />
    </div>
  </article>
</template>
