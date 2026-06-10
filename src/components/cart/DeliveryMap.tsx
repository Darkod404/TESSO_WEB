import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type LatLng = { lat: number; lng: number }

type DeliveryMapProps = {
  position: LatLng
  zoom?: number
  onChange: (pos: LatLng) => void
}

const burgundyPin = L.divIcon({
  className: 'pz-map-pin',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0Z" fill="#801a15"/>
    <circle cx="15" cy="15" r="6" fill="#fff"/>
  </svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
})

function Recenter({ position, zoom }: { position: LatLng; zoom?: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([position.lat, position.lng], zoom ?? map.getZoom(), { animate: true })
  }, [map, position.lat, position.lng, zoom])
  return null
}

export function DeliveryMap({ position, zoom, onChange }: DeliveryMapProps) {
  const markerRef = useRef<L.Marker>(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker) {
          const { lat, lng } = marker.getLatLng()
          onChange({ lat, lng })
        }
      },
    }),
    [onChange],
  )

  return (
    <div className="cart-map">
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="cart-map__canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable
          icon={burgundyPin}
          position={[position.lat, position.lng]}
          ref={markerRef}
          eventHandlers={eventHandlers}
        />
        <Recenter position={position} zoom={zoom} />
      </MapContainer>
      <p className="cart-map__hint">Arrastra el pin rojo para ajustar la ubicación exacta.</p>
    </div>
  )
}

export type GeocodeQuery = {
  street?: string
  city?: string
  state?: string
}

/** Nivel de precisión alcanzado por la geocodificación. */
export type GeocodePrecision = 'address' | 'street' | 'city' | 'none'

export type GeocodeResult = {
  position: LatLng
  precision: GeocodePrecision
}

type NominatimRow = {
  lat: string
  lon: string
  addresstype?: string
  type?: string
  class?: string
}

/** Normaliza una dirección colombiana ("Calle 35 bis # 1-39") para Nominatim. */
function normalizeStreet(street: string): string {
  return street
    .replace(/#/g, ' ')
    .replace(/\bNo\.?\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

async function nominatim(params: Record<string, string>): Promise<NominatimRow[]> {
  const search = new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    limit: '1',
    countrycodes: 'co',
    ...params,
  })
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${search.toString()}`, {
    headers: { 'Accept-Language': 'es' },
  })
  if (!res.ok) return []
  return (await res.json()) as NominatimRow[]
}

function precisionOf(row: NominatimRow): GeocodePrecision {
  const t = row.addresstype ?? row.type ?? ''
  if (t === 'house' || t === 'building' || row.class === 'building') return 'address'
  if (t === 'road' || row.class === 'highway') return 'street'
  return 'city'
}

/**
 * Geocodifica una dirección con Nominatim usando búsqueda estructurada y sesgada
 * a la ciudad/departamento. Intenta dirección exacta → calle → centro de ciudad.
 */
export async function geocodeAddress(query: GeocodeQuery): Promise<GeocodeResult | null> {
  const city = query.city?.trim()
  const state = query.state?.trim()
  const street = query.street ? normalizeStreet(query.street) : ''

  try {
    // 1) Dirección estructurada (calle + ciudad + departamento).
    if (street && city) {
      const rows = await nominatim({ street, city, state: state ?? '' })
      if (rows.length) {
        return { position: { lat: Number(rows[0].lat), lng: Number(rows[0].lon) }, precision: precisionOf(rows[0]) }
      }
    }
    // 2) Solo ciudad + departamento (centro de la ciudad).
    if (city) {
      const rows = await nominatim({ city, state: state ?? '' })
      if (rows.length) {
        return { position: { lat: Number(rows[0].lat), lng: Number(rows[0].lon) }, precision: 'city' }
      }
    }
    return null
  } catch {
    return null
  }
}
