
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { SKY_Y } from '../../config/scene'
import { overlayLayer } from '../../store/sceneState'
import { remap01, smoothstep } from '../../utils/math'
import { createPlexus, createShardGeometry } from './crystalGeometry'
import CrystalCallout from './CrystalCallout'

const VIEW_DISTANCE = 7.5 // camera distance at the section keyframe — callout fully visible here

function FrozenPenguin() {
  return (
    <group scale={0.62} position={[0, -0.35, 0]}>
      <mesh scale={[0.55, 0.7, 0.5]} position={[0, 0.7, 0]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh scale={[0.4, 0.55, 0.3]} position={[0, 0.62, 0.24]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#f0f9ff" roughness={0.4} />
      </mesh>
      <mesh scale={[0.42, 0.4, 0.4]} position={[0, 1.5, 0]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh scale={[0.12, 0.07, 0.14]} position={[0, 1.45, 0.38]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>
    </group>
  )
}

function FrozenToken() {
  return (
    <group rotation={[Math.PI / 2, 0, 0.3]} scale={0.9}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.55, 0.14, 48]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.42, 0.04, 12, 48]} />
        <meshStandardMaterial color="#e0f2fe" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

const INNER = { penguin: FrozenPenguin, token: FrozenToken }

export default function Crystal({ index, position, item }) {
  const group = useRef()
  const shard = useRef()
  const callout = useRef()
  const geometry = useMemo(() => createShardGeometry(index + 3), [index])
  const plexus = useMemo(() => createPlexus(index + 11), [index])
  const Inner = INNER[item.inner] ?? FrozenToken

  useEffect(
    () => () => {
      geometry.dispose()
      plexus.lines.dispose()
      plexus.dots.dispose()
    },
    [geometry, plexus],
  )

  useFrame(({ camera, clock }, delta) => {
    const t = clock.elapsedTime
    const g = group.current
    const [x, y, z] = position

    // Rise into frame as the camera climbs; drop away once the camera flies past.
    const below = Math.max(0, SKY_Y - camera.position.y) * 0.6
    const passed = Math.max(0, z + 3 - camera.position.z)
    g.position.set(x, y - below - passed * passed * 0.3 + Math.sin(t * 0.6 + index) * 0.12, z)

    const dist = camera.position.distanceTo(g.position)
    g.visible = dist < 40
    if (!g.visible) return

    shard.current.rotation.y += delta * 0.16
    shard.current.rotation.z = Math.sin(t * 0.35 + index) * 0.2

    const show = 1 - smoothstep(remap01(Math.abs(dist - VIEW_DISTANCE), 0.6, 3.5))
    if (callout.current) {
      callout.current.style.opacity = show.toFixed(3)
      callout.current.style.visibility = show > 0.01 ? 'visible' : 'hidden'
    }
  })

  return (
    <group ref={group} position={position}>
      <group ref={shard}>
        <mesh geometry={geometry}>
          <MeshTransmissionMaterial
            transmissionSampler
            backside={false}
            transmission={0.95}
            thickness={1.1}
            roughness={0.08}
            ior={1.4}
            chromaticAberration={0.35}
            anisotropicBlur={0.1}
            distortion={0.15}
            distortionScale={0.3}
            temporalDistortion={0.02}
            color="#e0f2fe"
            attenuationColor="#38bdf8"
            attenuationDistance={5}
            flatShading
          />
        </mesh>
        <Inner />
        <Sparkles count={20} scale={[1.5, 2.0, 1.5]} size={1.8} speed={0.3} color="#7dd3fc" />
      </group>

      <lineSegments geometry={plexus.lines}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} depthWrite={false} />
      </lineSegments>
      <points geometry={plexus.dots}>
        <pointsMaterial color="#7dd3fc" size={0.05} transparent opacity={0.8} depthWrite={false} />
      </points>

      <Html ref={callout} portal={overlayLayer} zIndexRange={[30, 0]} style={{ opacity: 0 }}>
        <CrystalCallout item={item} />
      </Html>
    </group>
  )
}