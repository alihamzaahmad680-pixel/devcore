import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { COLORS, STAGE } from '../../config/scene'
import { sceneState } from '../../store/sceneState'
import ParticleCharacter from './ParticleCharacter'

const GROOVES = [1.35, 2.1, 2.85, 3.6]

export default function Showcase({ particleCount }) {
  const { size } = useThree()
  const isMobile = size.width < 768

  const root = useRef()
  const halo = useRef()
  const rim = useRef()

  const radialSegments = isMobile ? 48 : 96
  const torusSegments = isMobile ? 64 : 128

  const responsiveScale = useMemo(() => {
    if (size.width < 480) return 0.72 
    if (size.width < 768) return 0.85 
    return 1.0 // Desktop standard scale
  }, [size.width])

  const effectiveParticleCount = useMemo(() => {
    return isMobile ? Math.floor(particleCount * 0.6) : particleCount
  }, [particleCount, isMobile])

  useFrame(({ camera, clock }, delta) => {
    if (!root.current) return
    root.current.visible = camera.position.z < -30
    if (!root.current.visible) return

    const s = sceneState.fx?.showcase || 0

    if (halo.current) {
      halo.current.rotation.z += delta * 0.2
      halo.current.position.y = 4.4 + Math.sin(clock.elapsedTime * 0.8) * 0.08
      halo.current.scale.setScalar((0.6 + s * 0.4) * (isMobile ? 0.85 : 1.0))
    }

    // Smooth HDR bloom ramp without warm/yellow tinting
    if (rim.current) {
      rim.current.color.setRGB(0.5 + s * 1.8, 0.7 + s * 2.2, 1.0 + s * 2.5)
    }
  })

  return (
    <group ref={root} position={STAGE.position} scale={responsiveScale}>
      {/* Base Stage Snow Cylinder */}
      <mesh receiveShadow>
        <cylinderGeometry args={[4.3, 4.6, 0.3, radialSegments]} />
        <meshStandardMaterial color={COLORS.snow || '#f2f7fa'} roughness={0.3} metalness={0.02} />
      </mesh>

      {/* Concentric Decorative Rings */}
      {GROOVES.map((r) => (
        <mesh key={r} rotation-x={Math.PI / 2} position-y={0.155}>
          <torusGeometry args={[r, 0.035, 8, torusSegments]} />
          <meshStandardMaterial color="#dbeafe" roughness={0.2} />
        </mesh>
      ))}

      {/* Outer Glowing Rim */}
      <mesh rotation-x={Math.PI / 2} position-y={0.12}>
        <torusGeometry args={[4.35, 0.07, 10, torusSegments]} />
        <meshBasicMaterial ref={rim} toneMapped={false} />
      </mesh>

      {/* Inner Pedestal */}
      <mesh position-y={0.27}>
        <cylinderGeometry args={[1.15, 1.2, 0.24, isMobile ? 32 : 64]} />
        <meshStandardMaterial color="#c0d4e8" roughness={0.25} />
      </mesh>

      {/* Floating Overhead Halo */}
      <mesh ref={halo} rotation-x={Math.PI / 2} position-y={4.4}>
        <torusGeometry args={[1.8, 0.08, 12, torusSegments]} />
        <meshBasicMaterial color={[1.5, 2.2, 3.0]} toneMapped={false} />
      </mesh>

      {/* Character Particle System */}
      <group position-y={0.39}>
        <ParticleCharacter count={effectiveParticleCount} />
      </group>
    </group>
  )
}