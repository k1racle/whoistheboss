import type { PageSeoData, PageSeoKey } from './page-seo'

export async function usePageSeo(page: PageSeoKey, fallback: PageSeoData) {
  const { data } = await useAsyncData(`page-seo-${page}`, async () =>
    await $fetch<PageSeoData>('/api/page-seo', { query: { page } }))

  return computed(() => data.value ?? fallback)
}
