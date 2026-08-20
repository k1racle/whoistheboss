export async function invalidatePublicCache(): Promise<void> {
  await useStorage('cache').clear().catch((error) => {
    console.error('[cache] Failed to invalidate public cache', error)
  })
}

