import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '../../config/scene'
import { fbm, ridged } from '../../utils/math'

const SIZE = 180
const SEGMENTS = 200

/** Height field: a gentle snow mound under the igloo rising into ridged mountains. */
function heightAt(x, z) {
  const r = Math.hypot(x, z)
  const plateau = THREE.MathUtils.smoothstep(r, 3.5, 26) // flat around the igloo
  const mounds = (fbm(x * 0.12, z * 0.12, 4) - 0.5) * 1.6
  const peaks = ridged(x * 0.035 + 7.3, z * 0.035 - 2.1, 5) * 26
  const bump = (fbm(x * 0.9, z * 0.9, 3) - 0.5) * 0.22 // snow surface detail
  return mounds * (0.25 + plateau) + peaks * plateau * plateau + bump - 0.15
}

function buildTerrain() {
  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS)
  geometry.rotateX(-Math.PI / 2)
  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)))
  }
  geometry.computeVertexNormals()

  // Slope-based colouring: Crisp ice-snow on flats, soft frosty rock on steep faces
  const normals = geometry.attributes.normal
  const colors = new Float32Array(pos.count * 3)
  const snow = new THREE.Color(COLORS.snow || '#f2f7fa')
  const rock = new THREE.Color(COLORS.rock || '#b0c4de') // Replaced muddy grey with clean ice-slate
  const c = new THREE.Color()

  for (let i = 0; i < pos.count; i++) {
    const flatness = THREE.MathUtils.smoothstep(normals.getY(i), 0.5, 0.85)
    c.copy(rock).lerp(snow, flatness)
    c.toArray(colors, i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

export default function Terrain() {
  const geometry = useMemo(buildTerrain, [])
  const mesh = useRef()
  useEffect(() => () => geometry.dispose(), [geometry])

  // Fully fogged out once the camera is up in the clouds — skip drawing it.
  useFrame(({ camera }) => {
    if (mesh.current) {
      mesh.current.visible = camera.position.y < 24
    }
  })

  return (
    <mesh ref={mesh} geometry={geometry} receiveShadow>
      {/* Reduced roughness to eliminate sandy noise artifacts */}
      <meshStandardMaterial 
        vertexColors 
        roughness={0.35} 
        metalness={0.02} 
        envMapIntensity={0.6}
      />
    </mesh>
  )
}