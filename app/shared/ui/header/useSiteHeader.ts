export function useSiteHeader() {
  const logoVisible = useState<boolean>('site-header-logo-visible', () => true)

  return {
    logoVisible,
  }
}
