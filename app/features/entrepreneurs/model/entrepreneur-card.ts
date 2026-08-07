import type { EntrepreneurListItem } from '@features/entrepreneurs/model/entrepreneur.types'
import type { LandingHeroCard } from '@features/landing/model/landing.data'
import { ROUTES } from '@shared/navigation'

export function toLandingHeroCard(entrepreneur: EntrepreneurListItem): LandingHeroCard {
  const image = entrepreneur.photo || '/images/placeholder.svg'

  return {
    id: entrepreneur.slug,
    name: entrepreneur.name,
    role: entrepreneur.title,
    company: '',
    image,
    imageHover: entrepreneur.hoverPhoto || image,
    imageAlt: `Карточка героя ${entrepreneur.name}`,
    href: ROUTES.ENTREPRENEUR(entrepreneur.slug),
  }
}
