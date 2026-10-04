import { Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, CRYSTALS, INTRO_CAMERA } from '../../config/scene'
import { PORTFOLIO } from '../../config/content'
import { sceneState } from '../../store/sceneState'
import CameraRig from './CameraRig'
import Lighting from './Lighting'
import Terrain from './Terrain'
import Igloo from './Igloo'
import Snow from './Snow'
import Clouds from './Clouds'
import Crystal from './Crystal'
import PortalRing from './PortalRing'
import Showcase from './Showcase'
import Effects from './Effects'

const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768
const MAX_DPR = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)

/** Fog density follows the scroll timeline smoothly */
function FogController() {
  useFrame(({ scene }) => {
    if (scene.fog) {
      scene.fog.density = sceneState.fx.fog
    }
  })
  return null
}

export default function Scene3D({ onReady }) {
  const [dpr, setDpr] = useState(MAX_DPR)
  const [quality, setQuality] = useState(isSmallScreen ? 'low' : 'high')

  // Deep High-Contrast UK Agency Theme Fog Color
  const themeFogColor = COLORS?.fog || '#030712'

  return (
    <div className="fixed inset-0 -z-10 bg-[#030712]" aria-hidden="true">
      <Canvas
        flat
        shadows
        dpr={dpr}
        camera={{ position: INTRO_CAMERA, fov: 35, near: 0.1, far: 140 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onCreated={() => onReady?.()}
      >
        {/* High-Contrast Deep Dark Canvas Background */}
        <color attach="background" args={[themeFogColor]} />
        <fogExp2 attach="fog" args={[themeFogColor, sceneState.fx.fog || 0.005]} />
        <FogController />

        {/* Performance Scaling */}
        <PerformanceMonitor
          flipflops={3}
          onIncline={() => {
            setDpr(MAX_DPR)
            if (!isSmallScreen) setQuality('high')
          }}
          onDecline={() => {
            setDpr(1)
            setQuality('low')
          }}
          onFallback={() => {
            setDpr(1)
            setQuality('low')
          }}
        />

        {/* Camera and Dynamic Lighting */}
        <CameraRig />
        <Lighting />

        {/* 3D Scene Components */}
        <Suspense fallback={null}>
          <Terrain />
          <Igloo />
          {CRYSTALS.map((crystal, i) => (
            <Crystal key={i} index={i} position={crystal.position} item={PORTFOLIO[i]} />
          ))}
          <PortalRing />
          <Showcase particleCount={isSmallScreen ? 8000 : 16000} />
          <Clouds />
          <Snow count={isSmallScreen ? 900 : 1800} />
          <Preload all />
        </Suspense>

        {/* Post-processing Effects */}
        <Effects quality={quality} />
      </Canvas>
    </div>
  )
}