import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { COLORS, PORTAL } from '../../config/scene'
import { sceneState } from '../../store/sceneState'
import { createRng, remap01, smoothstep } from '../../utils/math'

const INNER_RINGS = [
  { radius: 2.25, pieces: 5, speed: 0.35, tilt: 0.35 },
  { radius: 1.4, pieces: 4, speed: -0.55, tilt: -0.5 },
]
const HDR_WHITE = [3, 3.1, 3.2]

const _pos = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _q2 = new THREE.Quaternion()
const _euler = new THREE.Euler()
const _matrix = new THREE.Matrix4()
const Z_AXIS = new THREE.Vector3(0, 0, 1)

/** Inner arc fragments: each has a scattered pose and an orbit slot it snaps into. */
function buildFragments() {
  const rand = createRng(21)
  const list = []
  INNER_RINGS.forEach((ring, r) => {
    for (let i = 0; i < ring.pieces; i++) {
      list.push({
        ring: r,
        angle: (i / ring.pieces) * Math.PI * 2,
        scatter: new THREE.Vector3((rand() - 0.5) * 14, (rand() - 0.5) * 9, -rand() * 8 - 2),
        scatterQ: new THREE.Quaternion().setFromEuler(new THREE.Euler(rand() * 6, rand() * 6, rand() * 6)),
        delay: rand() * 0.35,
      })
    }
  })
  return list
}

/**
 * Ice portal: a segmented outer torus with light bleeding through its seams,
 * gyroscopic inner arcs that assemble from debris, and a blinding core.
 */
export default function PortalRing() {
  const root = useRef()
  const outer = useRef()
  const inner = useRef()
  const core = useRef()
  const spin = useRef(0)
  const fragments = useMemo(buildFragments, [])

  const segment = useMemo(() => {
    const arc = ((Math.PI * 2) / PORTAL.segments) * 0.93
    return new THREE.TorusGeometry(PORTAL.radius, 0.42, 12, 10, arc)
  }, [])
  const arcs = useMemo(
    () => INNER_RINGS.map((ring) => new THREE.TorusGeometry(ring.radius, 0.17, 4, 24, ((Math.PI * 2) / ring.pieces) * 0.68)),
    [],
  )
  const fragmentMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#aeb8c1', roughness: 0.45, metalness: 0.2, flatShading: true }),
    [],
  )
  useEffect(
    () => () => [segment, ...arcs, fragmentMaterial].forEach((resource) => resource.dispose()),
    [segment, arcs, fragmentMaterial],
  )

  useLayoutEffect(() => {
    for (let i = 0; i < PORTAL.segments; i++) {
      _matrix.makeRotationZ((i / PORTAL.segments) * Math.PI * 2)
      outer.current.setMatrixAt(i, _matrix)
    }
    outer.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame(({ camera, clock }, delta) => {
    root.current.visible = camera.position.z < -8
    if (!root.current.visible) return

    const t = clock.elapsedTime
    const { ring } = sceneState.fx
    spin.current += delta * (0.25 + ring * 0.6)

    outer.current.rotation.z = spin.current * 0.15

    // Inner fragments: debris → gyroscope.
    inner.current.children.forEach((mesh, i) => {
      const f = fragments[i]
      const cfg = INNER_RINGS[f.ring]
      const a = smoothstep(remap01(ring, f.delay, f.delay + 0.6))

      _euler.set(Math.sin(t * 0.5 + f.ring) * cfg.tilt, Math.cos(t * 0.4 + f.ring) * cfg.tilt, 0)
      _quat.setFromEuler(_euler).multiply(_q2.setFromAxisAngle(Z_AXIS, f.angle + spin.current * cfg.speed))
      _pos.copy(f.scatter).multiplyScalar(1 - a)

      mesh.position.copy(_pos)
      mesh.quaternion.copy(f.scatterQ).slerp(_quat, a)
    })

    // Core pulses brighter as the portal locks together.
    const s = 0.25 + ring * 0.25 + Math.sin(t * 3) * 0.03 * ring
    core.current.scale.setScalar(s)
  })

  return (
    <group ref={root} position={PORTAL.position}>
      <instancedMesh ref={outer} args={[segment, undefined, PORTAL.segments]}>
        <meshStandardMaterial color={COLORS.ice} roughness={0.3} metalness={0.1} envMapIntensity={1.2} />
      </instancedMesh>
      {/* HDR backing ring: bleeds through the seams between segments */}
      <mesh>
        <torusGeometry args={[PORTAL.radius, 0.3, 12, 96]} />
        <meshBasicMaterial color={HDR_WHITE} toneMapped={false} />
      </mesh>

      <group ref={inner}>
        {fragments.map((f, i) => (
          <mesh key={i} geometry={arcs[f.ring]} material={fragmentMaterial} />
        ))}
      </group>

      <mesh ref={core}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color={[6, 6, 6.4]} toneMapped={false} />
      </mesh>
      <Sparkles count={60} scale={[3, 3, 2]} size={3} speed={0.6} color="#ffffff" />
    </group>
  )
}
