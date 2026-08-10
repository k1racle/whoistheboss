export interface AdditionalSectionBase {
  id: string
  isVisible: boolean
  menuLabel: string
  menuDescription: string
  menuImage: string | null
}

export interface AdditionalSectionBiographyData extends AdditionalSectionBase {
  type: 'BIOGRAPHY'
  eyebrow: string
  title: string
  textOne: string
  textTwo: string
  textThree: string
  image: string | null
}

export interface AdditionalSectionAccentData extends AdditionalSectionBase {
  type: 'ACCENT'
  title: string
  textOne: string
  textTwo: string
}

export interface AdditionalSectionPortraitData extends AdditionalSectionBase {
  type: 'PORTRAIT'
  title: string
  text: string
  asideText: string
  image: string | null
}

export interface AdditionalSectionWideData extends AdditionalSectionBase {
  type: 'WIDE'
  title: string
  text: string
  bottomText: string
  image: string | null
}

export type AdditionalSectionData
  = | AdditionalSectionBiographyData
    | AdditionalSectionAccentData
    | AdditionalSectionPortraitData
    | AdditionalSectionWideData
