import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { ShirtModel, type ShirtFit, type ZoneDesigns, type ZoneRotations } from './ShirtModel'
import type { PrintZoneId } from './printZones'
import type { GarmentId } from './garments'

type ShirtViewer3DProps = {
  garmentId: GarmentId
  color: string
  fit: ShirtFit
  zoneDesigns: ZoneDesigns
  zoneRotations: ZoneRotations
  activeZone: PrintZoneId | null
  showZoneGuides: boolean
}

function Scene({ garmentId, color, fit, zoneDesigns, zoneRotations, activeZone, showZoneGuides }: ShirtViewer3DProps) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={0.35} />
      <Environment preset="city" />
      <ShirtModel
        garmentId={garmentId}
        color={color}
        fit={fit}
        zoneDesigns={zoneDesigns}
        zoneRotations={zoneRotations}
        activeZone={activeZone}
        showZoneGuides={showZoneGuides}
      />
      <ContactShadows position={[0, -0.42, 0]} opacity={0.35} scale={8} blur={2.5} far={1.2} />
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.4}
        maxDistance={3.2}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 0, 0]}
      />
    </>
  )
}

export function ShirtViewer3D(props: ShirtViewer3DProps) {
  return (
    <div className="pz-preview__canvas">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.05, 2.1], fov: 28, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
      <p className="pz-preview__hint">Arrastra para rotar 360°</p>
    </div>
  )
}
