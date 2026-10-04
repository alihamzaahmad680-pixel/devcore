import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SKY_Y } from '../../config/scene'
import { createRng } from '../../utils/math'
import { createPuffTexture } from '../../utils/textures'

const _pos = new THREE.Vector3()
const _scale = new THREE.Vector3()
const _matrix = new THREE.Matrix4()

function buildPuffs() {
  const rand = createRng(5)
  const puffs = []
  
  // Sky band the camera flies through (Saekilwe palo le bogolo gore e se khupetše)
  for (let i = 0; i < 30; i++) {
    puffs.push({
      position: new THREE.Vector3((rand() - 0.5) * 35, SKY_Y - 7 + rand() * 12, 6 - rand() * 76),
      size: 5 + rand() * 8, // Saese e fokolitšwe go tloga go 7-19 go ya go 5-13
      speed: 0.1 + rand() * 0.25,
      phase: rand() * Math.PI * 2,
    })
  }
  
  // Low mist drifting around the mountains
  for (let i = 0; i < 10; i++) {
    const a = rand() * Math.PI * 2
    const r = 16 + rand() * 18
    puffs.push({
      position: new THREE.Vector3(Math.cos(a) * r, 1.5 + rand() * 4, Math.sin(a) * r - 6),
      size: 6 + rand() * 6,
      speed: 0.05 + rand() * 0.1,
      phase: rand() * Math.PI * 2,
    })
  }
  return puffs
}

/** Camera-facing cloud puffs in a single instanced draw call. */
export default function Clouds() {
  const mesh = useRef()
  const puffs = useMemo(buildPuffs, [])
  const texture = useMemo(() => createPuffTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])

  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    const m = mesh.current
    if (!m) return

    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i]
      _pos.copy(p.position)
      _pos.x += Math.sin(t * p.speed + p.phase) * 1.5
      _scale.setScalar(p.size)
      _matrix.compose(_pos, camera.quaternion, _scale) // billboard
      m.setMatrixAt(i, _matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, puffs.length]} frustumCulled={false} renderOrder={2}>
      <planeGeometry />
      {/* Opacity e fokotšeditšwe go tloga go 0.9 go ya go 0.18 gore maru a se thibe sekirini */}
      <meshBasicMaterial 
        map={texture} 
        transparent 
        depthWrite={false} 
        opacity={0.18} 
        color="#dbeafe" 
      />
    </instancedMesh>
  )
}