import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { NORMALIZED_ZONES, resolveZone, type PrintZoneId, type ResolvedZone, type ResolveOptions } from './printZones'
import { GARMENTS, type GarmentConfig, type GarmentId } from './garments'

/**
 * Resuelve cada zona lanzando un rayo contra la malla para encontrar el punto y
 * la normal exactos de la superficie. Así los decals se asientan sobre la tela
 * aunque la zona esté en un borde, manga o área curva (evita que no se vean o
 * salgan cortados). Si el rayo no impacta, usa la posición analítica como respaldo.
 */
function resolveZonesOnGeometry(
  geometry: THREE.BufferGeometry,
  half: [number, number, number],
  opts: Partial<Omit<ResolveOptions, 'half'>>,
): ResolvedZone[] {
  const mesh = new THREE.Mesh(geometry)
  mesh.updateMatrixWorld(true)
  geometry.computeBoundingSphere()

  const raycaster = new THREE.Raycaster()
  const reach = Math.max(half[0], half[1], half[2]) * 4 + 1
  const projector = new THREE.Object3D()
  const width = half[0] * 2

  return NORMALIZED_ZONES.map((zone) => {
    const fallback = resolveZone(zone, { half, ...opts })
    const x = zone.fx * half[0]
    const y = zone.fy * half[1]

    let origin: THREE.Vector3
    let dir: THREE.Vector3
    if (zone.side === 'sleeve') {
      const sign = Math.sign(zone.fx) || 1
      origin = new THREE.Vector3(sign * reach, y, 0)
      dir = new THREE.Vector3(-sign, 0, 0)
    } else if (zone.side === 'back') {
      origin = new THREE.Vector3(x, y, -reach)
      dir = new THREE.Vector3(0, 0, 1)
    } else {
      origin = new THREE.Vector3(x, y, reach)
      dir = new THREE.Vector3(0, 0, -1)
    }

    raycaster.set(origin, dir)
    const hits = raycaster.intersectObject(mesh, false)
    const hit = hits.find((h) => h.face)
    if (!hit || !hit.face) return fallback

    const normal = hit.face.normal.clone().normalize()
    const point = hit.point.clone().add(normal.clone().multiplyScalar(0.002))

    projector.position.copy(point)
    projector.up.set(0, 1, 0)
    projector.lookAt(point.clone().add(normal))
    projector.rotateZ(Math.PI)
    projector.rotateY(Math.PI)

    let w: number
    let h: number
    if (Array.isArray(zone.sizeFrac)) {
      w = zone.sizeFrac[0] * width
      h = zone.sizeFrac[1] * half[1] * 2
    } else {
      w = zone.sizeFrac * width
      h = w
    }
    const depth = zone.side === 'sleeve' ? half[2] * 0.5 : half[2] * 1.4

    return {
      id: zone.id,
      side: zone.side,
      position: [point.x, point.y, point.z],
      rotation: [projector.rotation.x, projector.rotation.y, projector.rotation.z],
      scale: [w, h, depth],
    }
  })
}

export type ZoneDesigns = Partial<Record<PrintZoneId, string>>
export type ZoneRotations = Partial<Record<PrintZoneId, number>>

export type ShirtFit = 'boxy' | 'regular' | 'oversize' | 'crop'

/** Aplica un giro (radianes) alrededor de la normal de la superficie (eje Z local del decal). */
function withRoll(rotation: [number, number, number], roll: number): [number, number, number] {
  if (!roll) return rotation
  const o = new THREE.Object3D()
  o.rotation.set(rotation[0], rotation[1], rotation[2])
  o.rotateZ(roll)
  return [o.rotation.x, o.rotation.y, o.rotation.z]
}

const FIT_TRANSFORMS: Record<
  ShirtFit,
  { scale: [number, number, number]; position: [number, number, number] }
> = {
  regular: { scale: [1, 1, 1], position: [0, -0.04, 0] },
  boxy: { scale: [1.14, 0.92, 1.12], position: [0, -0.02, 0] },
  oversize: { scale: [1.18, 1.1, 1.16], position: [0, -0.08, 0] },
  crop: { scale: [1.04, 0.66, 1.04], position: [0, 0.06, 0] },
}

type ShirtModelProps = {
  garmentId: GarmentId
  color: string
  fit: ShirtFit
  zoneDesigns: ZoneDesigns
  zoneRotations: ZoneRotations
  activeZone: PrintZoneId | null
  showZoneGuides: boolean
}

function ZoneGuideDecal({ zone }: { zone: ResolvedZone }) {
  const guideTexture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, size, size)
    const pad = 20
    ctx.fillStyle = 'rgba(128, 26, 21, 0.12)'
    ctx.fillRect(pad, pad, size - pad * 2, size - pad * 2)
    ctx.strokeStyle = '#801a15'
    ctx.lineWidth = 8
    ctx.setLineDash([18, 12])
    ctx.strokeRect(pad, pad, size - pad * 2, size - pad * 2)
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  useEffect(() => () => guideTexture.dispose(), [guideTexture])

  return (
    <Decal position={zone.position} rotation={zone.rotation} scale={zone.scale} map={guideTexture} depthTest={false} />
  )
}

function ZoneDesignDecal({ imageUrl, zone, roll }: { imageUrl: string; zone: ResolvedZone; roll: number }) {
  const texture = useTexture(imageUrl)
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 16
    texture.needsUpdate = true
    invalidate()
  }, [texture, invalidate])

  const rotation = useMemo(() => withRoll(zone.rotation, roll), [zone.rotation, roll])

  return (
    <Decal position={zone.position} rotation={rotation} scale={zone.scale} depthTest={false}>
      <meshStandardMaterial
        map={texture}
        transparent
        toneMapped={false}
        roughness={0.85}
        polygonOffset
        polygonOffsetFactor={-10}
        depthTest={false}
      />
    </Decal>
  )
}

export function ShirtModel({
  garmentId,
  color,
  fit,
  zoneDesigns,
  zoneRotations,
  activeZone,
  showZoneGuides,
}: ShirtModelProps) {
  const config: GarmentConfig = GARMENTS[garmentId]
  const { scene } = useGLTF(config.modelPath)
  const groupRef = useRef<THREE.Group>(null)

  const { geometry, material, half } = useMemo(() => {
    let srcGeometry: THREE.BufferGeometry | null = null
    let srcMaterial: THREE.Material | null = null
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh && !srcGeometry) {
        const mesh = obj as THREE.Mesh
        srcGeometry = mesh.geometry
        srcMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
      }
    })

    const geom = (srcGeometry as unknown as THREE.BufferGeometry).clone()
    if (config.preRotation) {
      geom.rotateX(config.preRotation[0])
      geom.rotateY(config.preRotation[1])
      geom.rotateZ(config.preRotation[2])
    }
    geom.computeBoundingBox()
    if (config.recenter && geom.boundingBox) {
      const center = new THREE.Vector3()
      geom.boundingBox.getCenter(center)
      geom.translate(-center.x, -center.y, -center.z)
      geom.computeBoundingBox()
    }
    const size = new THREE.Vector3()
    geom.boundingBox!.getSize(size)

    const mat = (srcMaterial as unknown as THREE.Material).clone() as THREE.MeshStandardMaterial

    return {
      geometry: geom,
      material: mat,
      half: [size.x / 2, size.y / 2, size.z / 2] as [number, number, number],
    }
  }, [scene, config])

  const zones = useMemo(
    () => resolveZonesOnGeometry(geometry, half, config.zoneOptions ?? {}),
    [geometry, half, config],
  )
  const zoneById = useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones])

  const targetColor = useMemo(() => new THREE.Color(color), [color])

  const fitTransform = FIT_TRANSFORMS[fit]
  const targetScale = useMemo(() => {
    if (config.supportsFit) {
      return new THREE.Vector3(
        fitTransform.scale[0] * config.displayScale,
        fitTransform.scale[1] * config.displayScale,
        fitTransform.scale[2] * config.displayScale,
      )
    }
    return new THREE.Vector3(config.displayScale, config.displayScale, config.displayScale)
  }, [config, fitTransform])

  const targetPosition = useMemo(() => {
    const p = config.supportsFit ? fitTransform.position : config.displayPosition
    return new THREE.Vector3(...p)
  }, [config, fitTransform])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((_state, delta) => {
    const t = Math.min(1, delta * 6)
    material.color.lerp(targetColor, t)
    const group = groupRef.current
    if (group) {
      group.scale.lerp(targetScale, t)
      group.position.lerp(targetPosition, t)
    }
  })

  const designEntries = Object.entries(zoneDesigns).filter((entry): entry is [PrintZoneId, string] =>
    Boolean(entry[1]),
  )

  const activeResolved = activeZone ? zoneById.get(activeZone) : undefined

  return (
    <group ref={groupRef} scale={targetScale.toArray()} position={targetPosition.toArray()}>
      <mesh castShadow receiveShadow geometry={geometry} material={material} dispose={null}>
        {showZoneGuides && activeResolved && !zoneDesigns[activeResolved.id] && (
          <ZoneGuideDecal key={`guide-${garmentId}-${activeResolved.id}`} zone={activeResolved} />
        )}
        {designEntries.map(([zoneId, imageUrl]) => {
          const zone = zoneById.get(zoneId)
          if (!zone) return null
          return (
            <Suspense key={`design-${zoneId}-${imageUrl}`} fallback={null}>
              <ZoneDesignDecal zone={zone} imageUrl={imageUrl} roll={zoneRotations[zoneId] ?? 0} />
            </Suspense>
          )
        })}
      </mesh>
    </group>
  )
}

useGLTF.preload('/models/shirt.glb')
// useGLTF.preload('/models/hoodie.glb') // Hoodie deshabilitado por ahora
