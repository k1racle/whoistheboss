export function useSiteHeader() {
  const logoVisible = useState<boolean>('site-header-logo-visible', () => false)

  return {
    logoVisible,
  }
}
