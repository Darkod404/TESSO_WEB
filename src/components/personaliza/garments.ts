import type { ResolveOptions } from './printZones'

export interface GarmentConfig {
  id: string
  label: string
  modelPath: string
  /** Rotación (radianes) horneada en la geometría para corregir orientación del modelo. */
  preRotation?: [number, number, number]
  /** Recentrar la geometría en su bounding box (útil para modelos descentrados). */
  recenter: boolean
  /** Escala base del grupo. */
  displayScale: number
  /** Posición base del grupo. */
  displayPosition: [number, number, number]
  /** Si admite los cortes por escala (boxy/oversize/crop). */
  supportsFit: boolean
  /** Opciones de resolución de zonas específicas de la prenda. */
  zoneOptions?: Partial<Omit<ResolveOptions, 'half'>>
}

export const GARMENTS = {
  camiseta: {
    id: 'camiseta',
    label: 'Camiseta',
    modelPath: '/models/shirt.glb',
    recenter: false,
    displayScale: 1.05,
    displayPosition: [0, -0.04, 0],
    supportsFit: true,
  },
  // NOTA: Hoodie deshabilitado por ahora (pendiente de calibración visual).
  // Para reactivarlo, descomenta esta entrada y la prenda volverá al selector.
  // hoodie: {
  //   id: 'hoodie',
  //   label: 'Hoodie',
  //   modelPath: '/models/hoodie.glb',
  //   preRotation: [-Math.PI / 2, 0, 0],
  //   recenter: true,
  //   displayScale: 0.62,
  //   displayPosition: [0, -0.02, 0],
  //   supportsFit: false,
  //   zoneOptions: { surfaceOffset: 1.05, verticalOffset: 0.02 },
  // },
} satisfies Record<string, GarmentConfig>

export type GarmentId = keyof typeof GARMENTS

export const GARMENT_LIST: GarmentConfig[] = Object.values(GARMENTS)
export const DEFAULT_GARMENT: GarmentId = 'camiseta'
