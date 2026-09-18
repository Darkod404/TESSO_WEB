import { getApiBaseUrl } from './apiBase'

export type ShippingDepartment = {
  id: string
  name: string
}

export type ShippingCity = {
  id: string
  name: string
  cost: number
  etaDays: string
}

export type ShippingQuote = {
  cost: number
  etaDays: string
  isFree: boolean
  located: boolean
  freeShippingThreshold: number
}

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

export const shippingApi = {
  departments: () => getJson<ShippingDepartment[]>('/api/shipping/departments'),
  cities: (department: string) =>
    getJson<ShippingCity[]>(
      `/api/shipping/cities?department=${encodeURIComponent(department)}`,
    ),
  quote: (department: string, city: string, subtotal: number) =>
    getJson<ShippingQuote>(
      `/api/shipping/quote?department=${encodeURIComponent(department)}&city=${encodeURIComponent(city)}&subtotal=${subtotal}`,
    ),
}
