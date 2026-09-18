import { getApiBaseUrl } from './apiBase'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}${text ? `: ${text}` : ''}`)
  }
  return (await res.json()) as T
}

export type SiteCopy = {
  slotKey: string
  kicker: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  ctaPrimaryLabel: string | null
  ctaPrimaryHref: string | null
  ctaSecondaryLabel: string | null
  ctaSecondaryHref: string | null
}

export type Pillar = {
  id: string
  title: string
  body: string
  imageUrl: string | null
  sortOrder: number
}

export type FaqItem = {
  id: string
  question: string
  answer: string
  showOnHome: boolean
  sortOrder: number
}

export type FooterLink = {
  id: string
  group: 'brand' | 'help' | 'social' | string
  label: string
  href: string
  iconKey: string | null
  sortOrder: number
}

export type PolicyPage = {
  slug: string
  title: string
  summary: string | null
  bodyHtml: string
}

export type MediaSlot = {
  slotKey: string
  url: string
  altText: string | null
}

export type HomeContent = {
  locale: string
  copy: Record<string, SiteCopy>
  pillars: Pillar[]
  faqs: FaqItem[]
  media: Record<string, MediaSlot>
}

export type FooterContent = {
  locale: string
  links: FooterLink[]
}

export const contentApi = {
  home: (locale = 'es') => getJson<HomeContent>(`/api/content/home?locale=${locale}`),
  faqs: (locale = 'es') => getJson<FaqItem[]>(`/api/content/faqs?locale=${locale}`),
  footer: (locale = 'es') => getJson<FooterContent>(`/api/content/footer?locale=${locale}`),
  policy: (slug: string, locale = 'es') =>
    getJson<PolicyPage>(`/api/content/policies/${encodeURIComponent(slug)}?locale=${locale}`),
  media: () => getJson<Record<string, MediaSlot>>('/api/content/media'),
}
