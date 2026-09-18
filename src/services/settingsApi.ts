import { getApiBaseUrl } from './apiBase'

export type StoreSettings = {
  currency: string
  freeShippingThreshold: number
  defaultShippingCost: number
  defaultShippingEta: string
  contactPhone: string
  contactPhoneDisplay: string
  whatsappUrl: string
  whatsappDefaultMessage: string
  contactEmail: string
  contactLocation: string
  productionLeadTimeText: string
  storeHoursText: string
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  const res = await fetch(`${getApiBaseUrl()}/api/settings`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return (await res.json()) as StoreSettings
}
