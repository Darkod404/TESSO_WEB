import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchStoreSettings, type StoreSettings } from '../services/settingsApi'

const DEFAULTS: StoreSettings = {
  currency: 'COP',
  freeShippingThreshold: 150000,
  defaultShippingCost: 18900,
  defaultShippingEta: '5-8',
  contactPhone: '573169677206',
  contactPhoneDisplay: '+57 316 967 7206',
  whatsappUrl:
    'https://api.whatsapp.com/send/?phone=573169677206&text&type=phone_number&app_absent=0',
  whatsappDefaultMessage: 'Hola T3SO, tengo una pregunta sobre…',
  contactEmail: 't3so250314@gmail.com',
  contactLocation: 'Tienda online · Bogotá, Colombia',
  productionLeadTimeText:
    'Colección: 2-3 días hábiles en Bogotá. Personalizados: 7-10 días según complejidad y ciudad.',
  storeHoursText: 'Atención por WhatsApp de lunes a viernes, 9:00 a. m. – 6:00 p. m.',
}

const StoreSettingsContext = createContext<StoreSettings>(DEFAULTS)

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULTS)

  useEffect(() => {
    fetchStoreSettings()
      .then(setSettings)
      .catch(() => {
        /* keep defaults */
      })
  }, [])

  return (
    <StoreSettingsContext.Provider value={settings}>{children}</StoreSettingsContext.Provider>
  )
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext)
}
