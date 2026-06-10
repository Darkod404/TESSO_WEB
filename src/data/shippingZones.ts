/**
 * Tarifas de envío por zona (Colombia), en pesos colombianos (COP).
 * Modelo simple por ciudad/departamento. Para producción, reemplazar por la
 * tabla real de la transportadora.
 */

export type ShippingCity = {
  name: string
  /** Costo de envío en COP. */
  cost: number
  /** Días hábiles estimados de entrega. */
  etaDays: string
}

export type ShippingDepartment = {
  name: string
  cities: ShippingCity[]
}

/** Compra mínima (COP) para envío gratis. */
export const FREE_SHIPPING_THRESHOLD = 150000

/** Tarifa por defecto cuando la ciudad no está en la tabla. */
export const DEFAULT_SHIPPING_COST = 18900
export const DEFAULT_SHIPPING_ETA = '5-8'

export const SHIPPING_ZONES: ShippingDepartment[] = [
  {
    name: 'Cundinamarca',
    cities: [
      { name: 'Bogotá D.C.', cost: 8900, etaDays: '1-3' },
      { name: 'Soacha', cost: 9900, etaDays: '2-4' },
      { name: 'Chía', cost: 10900, etaDays: '2-4' },
      { name: 'Zipaquirá', cost: 11900, etaDays: '2-5' },
      { name: 'Facatativá', cost: 11900, etaDays: '2-5' },
    ],
  },
  {
    name: 'Antioquia',
    cities: [
      { name: 'Medellín', cost: 12900, etaDays: '2-4' },
      { name: 'Envigado', cost: 12900, etaDays: '2-4' },
      { name: 'Bello', cost: 13900, etaDays: '2-5' },
      { name: 'Itagüí', cost: 13900, etaDays: '2-5' },
      { name: 'Rionegro', cost: 14900, etaDays: '3-6' },
    ],
  },
  {
    name: 'Valle del Cauca',
    cities: [
      { name: 'Cali', cost: 12900, etaDays: '2-4' },
      { name: 'Palmira', cost: 13900, etaDays: '3-5' },
      { name: 'Buenaventura', cost: 16900, etaDays: '4-7' },
      { name: 'Tuluá', cost: 14900, etaDays: '3-6' },
    ],
  },
  {
    name: 'Atlántico',
    cities: [
      { name: 'Barranquilla', cost: 15900, etaDays: '3-6' },
      { name: 'Soledad', cost: 16900, etaDays: '3-6' },
      { name: 'Malambo', cost: 17900, etaDays: '4-7' },
    ],
  },
  {
    name: 'Bolívar',
    cities: [
      { name: 'Cartagena', cost: 16900, etaDays: '3-6' },
      { name: 'Magangué', cost: 19900, etaDays: '5-8' },
    ],
  },
  {
    name: 'Santander',
    cities: [
      { name: 'Bucaramanga', cost: 13900, etaDays: '3-5' },
      { name: 'Floridablanca', cost: 14900, etaDays: '3-5' },
      { name: 'Girón', cost: 14900, etaDays: '3-6' },
    ],
  },
  {
    name: 'Risaralda',
    cities: [
      { name: 'Pereira', cost: 13900, etaDays: '2-5' },
      { name: 'Dosquebradas', cost: 13900, etaDays: '2-5' },
    ],
  },
  {
    name: 'Tolima',
    cities: [
      { name: 'Ibagué', cost: 13900, etaDays: '3-5' },
      { name: 'Espinal', cost: 15900, etaDays: '4-7' },
      { name: 'Alpujarra', cost: 21900, etaDays: '6-9' },
    ],
  },
  {
    name: 'Nariño',
    cities: [
      { name: 'Pasto', cost: 17900, etaDays: '4-8' },
      { name: 'Ipiales', cost: 19900, etaDays: '5-9' },
    ],
  },
  {
    name: 'Norte de Santander',
    cities: [
      { name: 'Cúcuta', cost: 15900, etaDays: '4-7' },
      { name: 'Ocaña', cost: 18900, etaDays: '5-8' },
    ],
  },
]

export function getCities(departmentName: string): ShippingCity[] {
  return SHIPPING_ZONES.find((d) => d.name === departmentName)?.cities ?? []
}

export function getShippingCity(departmentName: string, cityName: string): ShippingCity | null {
  return getCities(departmentName).find((c) => c.name === cityName) ?? null
}

/** Devuelve el costo de envío para una ciudad, aplicando envío gratis por monto. */
export function resolveShippingCost(
  departmentName: string | null,
  cityName: string | null,
  subtotal: number,
): { cost: number; etaDays: string; isFree: boolean; located: boolean } {
  const city = departmentName && cityName ? getShippingCity(departmentName, cityName) : null
  const baseCost = city?.cost ?? DEFAULT_SHIPPING_COST
  const etaDays = city?.etaDays ?? DEFAULT_SHIPPING_ETA
  const located = Boolean(city)
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD
  return { cost: isFree ? 0 : baseCost, etaDays, isFree, located }
}
