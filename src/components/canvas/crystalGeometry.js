import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { createRng } from '../../utils/math'

export function createShardGeometry(seed) {
  const rand = createRng(seed)
  let geometry = new THREE.BoxGeometry(1.5, 2.1, 1.15, 3, 4, 3)
  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')
  geometry = mergeVertices(geometry) 

  const pos = geometry.attributes.position
  const v = new THREE.Vector3()
  const round = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    round.copy(v).normalize().multiplyScalar(v.length() * 0.82)
    v.lerp(round, 0.35)
    v.x += (rand() - 0.5) * 0.18
    v.y += (rand() - 0.5) * 0.22
    v.z += (rand() - 0.5) * 0.18
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geometry.computeVertexNormals()
  return geometry
}

/** Random "data network" around a crystal: line segments + node points. */
export function createPlexus(seed, nodes = 22) {
  const rand = createRng(seed)
  const points = []
  for (let i = 0; i < nodes; i++) {
    const dir = new THREE.Vector3(rand() - 0.5, (rand() - 0.5) * 1.4, rand() - 0.5).normalize()
    points.push(dir.multiplyScalar(1.3 + rand() * 1.6))
  }

  const segments = []
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if (points[i].distanceTo(points[j]) < 1.5) segments.push(points[i], points[j])
    }
  }

  return {
    lines: new THREE.BufferGeometry().setFromPoints(segments),
    dots: new THREE.BufferGeometry().setFromPoints(points),
  }
}
