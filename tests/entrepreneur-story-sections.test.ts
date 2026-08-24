import type { Entrepreneur } from '@prisma/client'
import { describe, expect, it } from 'vitest'
import { normalizeEntrepreneurStorySections } from '../server/utils/entrepreneur-story-sections'

function entrepreneurWith(storySections: unknown): Entrepreneur {
  return {
    name: 'Анна Иванова',
    photo: '/main-photo.jpg',
    bio: 'Текст с главного экрана',
    quote: 'Цитата с главного экрана',
    storySections,
  } as Entrepreneur
}

describe('entrepreneur biography titles', () => {
  it('does not replace an empty stored title with the entrepreneur name', () => {
    const [section] = normalizeEntrepreneurStorySections(
      entrepreneurWith([{
        id: 'biography',
        type: 'BIOGRAPHY',
        isVisible: true,
        menuLabel: 'Биография',
        menuDescription: '',
        menuImage: null,
        eyebrow: 'Биография',
        title: '',
        textOne: '',
        textTwo: '',
        textThree: '',
        image: null,
      }]),
      {},
      [],
      '',
    )

    expect(section?.type).toBe('BIOGRAPHY')
    expect(section?.title).toBe('')
    expect(section?.menuImage).toBeNull()
    if (section?.type === 'BIOGRAPHY') expect(section.image).toBeNull()
  })

  it('does not fill legacy biography content from the entrepreneur main fields', () => {
    const [section] = normalizeEntrepreneurStorySections(
      entrepreneurWith(null),
      {},
      ['/gallery-photo.jpg'],
      'Текст с главного экрана',
    )

    expect(section?.type).toBe('BIOGRAPHY')
    expect(section).toMatchObject({
      menuLabel: 'Биография',
      menuDescription: '',
      menuImage: null,
      eyebrow: '',
      title: '',
      textOne: '',
      textTwo: '',
      textThree: '',
      image: null,
    })
  })

  it('does not generate titles for other legacy text sections', () => {
    const sections = normalizeEntrepreneurStorySections(
      entrepreneurWith(null),
      {},
      [],
      '',
    )

    expect(sections.map(section => section.title)).toEqual(['', '', '', ''])
  })
})
