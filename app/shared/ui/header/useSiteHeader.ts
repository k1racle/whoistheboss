const scrollControlledRoutes = new Set(['/', '/shooting-request'])

export function isSiteHeaderLogoScrollControlled(path: string): boolean {
  return scrollControlledRoutes.has(path)
}

export function useSiteHeader() {
  const logoVisible = useState<boolean>('site-header-logo-visible', () => false)

  const syncLogoVisibility = (path: string) => {
    logoVisible.value = !isSiteHeaderLogoScrollControlled(path)
  }

  return {
    logoVisible,
    syncLogoVisibility,
  }
}
