export type PrintZoneId =
  | 'frente-completo'
  | 'frente-mediano'
  | 'centro-pecho'
  | 'atraves-pecho'
  | 'pecho-derecho'
  | 'pecho-izquierdo'
  | 'manga-derecha'
  | 'manga-izquierda'
  | 'vertical-derecha'
  | 'vertical-izquierda'
  | 'frente-inferior-der'
  | 'frente-inferior-izq'
  | 'espalda-completa'
  | 'espalda-mediana'
  | 'area-parche'
  | 'atraves-hombros'

export type PrintZoneSide = 'front' | 'back' | 'sleeve'

/**
 * Zonas definidas como fracciones del bounding box de la prenda, para que se
 * adapten automáticamente a cualquier modelo 3D (camiseta, hoodie, etc.).
 * - fx / fy: posición como fracción del semiancho / semialto (origen del modelo).
 * - sizeFrac: tamaño del decal como fracción del ancho (número) o [ancho, alto, prof].
 */
export interface NormalizedZone {
  id: PrintZoneId
  name: string
  hint: string
  side: PrintZoneSide
  fx: number
  fy: number
  sizeFrac: number | [number, number, number]
}

export const NORMALIZED_ZONES: NormalizedZone[] = [
  { id: 'frente-completo', name: 'Frente Completo', hint: 'hasta 30×40 cm', side: 'front', fx: 0, fy: -0.066, sizeFrac: 0.582 },
  { id: 'frente-mediano', name: 'Frente Mediano', hint: 'hasta 20×30 cm', side: 'front', fx: 0, fy: 0.197, sizeFrac: 0.4 },
  { id: 'centro-pecho', name: 'Centro del Pecho', hint: 'hasta 10×15 cm', side: 'front', fx: 0, fy: 0.131, sizeFrac: 0.218 },
  { id: 'atraves-pecho', name: 'A través del Pecho', hint: 'hasta 25×8 cm', side: 'front', fx: 0, fy: 0.164, sizeFrac: [0.473, 0.131, 0.37] },
  { id: 'pecho-derecho', name: 'Pecho Derecho', hint: 'hasta 8×8 cm', side: 'front', fx: -0.327, fy: 0.131, sizeFrac: 0.164 },
  { id: 'pecho-izquierdo', name: 'Pecho Izquierdo', hint: 'hasta 8×8 cm', side: 'front', fx: 0.327, fy: 0.131, sizeFrac: 0.164 },
  { id: 'manga-derecha', name: 'Manga Derecha', hint: 'hasta 8×8 cm', side: 'sleeve', fx: -1.091, fy: 0.197, sizeFrac: 0.164 },
  { id: 'manga-izquierda', name: 'Manga Izquierda', hint: 'hasta 8×8 cm', side: 'sleeve', fx: 1.091, fy: 0.197, sizeFrac: 0.164 },
  { id: 'vertical-derecha', name: 'Vertical Derecha', hint: 'hasta 10×40 cm', side: 'front', fx: -0.44, fy: -0.066, sizeFrac: [0.16, 0.5, 0.296] },
  { id: 'vertical-izquierda', name: 'Vertical Izquierda', hint: 'hasta 10×40 cm', side: 'front', fx: 0.44, fy: -0.066, sizeFrac: [0.16, 0.5, 0.296] },
  { id: 'frente-inferior-der', name: 'Frente Inferior Der.', hint: 'hasta 10×10 cm', side: 'front', fx: -0.364, fy: -0.426, sizeFrac: 0.182 },
  { id: 'frente-inferior-izq', name: 'Frente Inferior Izq.', hint: 'hasta 10×10 cm', side: 'front', fx: 0.364, fy: -0.426, sizeFrac: 0.182 },
  { id: 'espalda-completa', name: 'Espalda Completa', hint: 'hasta 30×45 cm', side: 'back', fx: 0, fy: -0.066, sizeFrac: 0.618 },
  { id: 'espalda-mediana', name: 'Espalda Mediana', hint: 'hasta 20×30 cm', side: 'back', fx: 0, fy: 0.197, sizeFrac: 0.4 },
  { id: 'area-parche', name: 'Área del Parche', hint: 'hasta 5×5 cm', side: 'back', fx: 0, fy: 0.393, sizeFrac: 0.109 },
  { id: 'atraves-hombros', name: 'A través de los Hombros', hint: 'hasta 25×8 cm', side: 'back', fx: 0, fy: 0.328, sizeFrac: [0.473, 0.131, 0.37] },
]

export const DEFAULT_PRINT_ZONE: PrintZoneId = 'centro-pecho'

export interface ResolvedZone {
  id: PrintZoneId
  side: PrintZoneSide
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number | [number, number, number]
}

export interface ResolveOptions {
  /** Semiejes del bounding box [x, y, z]. */
  half: [number, number, number]
  /** Desplazamiento vertical (en unidades locales) aplicado a todas las zonas. */
  verticalOffset?: number
  /** Cuánto sobresale el decal de la superficie (1 = en la malla). */
  surfaceOffset?: number
  /** Factor de profundidad para las mangas. */
  sleeveDepthFactor?: number
}

export function resolveZone(zone: NormalizedZone, opts: ResolveOptions): ResolvedZone {
  const [hx, hy, hz] = opts.half
  const surface = opts.surfaceOffset ?? 1.11
  const sleeveDepth = opts.sleeveDepthFactor ?? 0.3
  const vOffset = opts.verticalOffset ?? 0

  const width = hx * 2
  const x = zone.fx * hx
  const y = zone.fy * hy + vOffset

  const scale: number | [number, number, number] = Array.isArray(zone.sizeFrac)
    ? [zone.sizeFrac[0] * width, zone.sizeFrac[1] * hy * 2, zone.sizeFrac[2] * hz * 2]
    : zone.sizeFrac * width

  if (zone.side === 'sleeve') {
    const sign = Math.sign(zone.fx) || 1
    return {
      id: zone.id,
      side: zone.side,
      position: [x, y, hz * sleeveDepth],
      rotation: [0, sign * 0.35, -sign * 0.25],
      scale,
    }
  }

  const front = zone.side === 'front'
  return {
    id: zone.id,
    side: zone.side,
    position: [x, y, (front ? 1 : -1) * hz * surface],
    rotation: front ? [0, 0, 0] : [0, Math.PI, 0],
    scale,
  }
}

export function resolveZones(opts: ResolveOptions): ResolvedZone[] {
  return NORMALIZED_ZONES.map((z) => resolveZone(z, opts))
}
