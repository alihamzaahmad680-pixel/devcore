import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { createRng } from '../../utils/math'

const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()


function clean(geometry) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry.clone()
  
  Object.keys(g.attributes).forEach((name) => {
    if (name !== 'position' && name !== 'normal') {
      g.deleteAttribute(name)
    }
  })

  if (!g.attributes.normal) {
    g.computeVertexNormals()
  }
  
  return g
}

export function buildPenguinGeometry() {
  const parts = []

  const add = (geometry, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0]) => {
    _m.compose(
      new THREE.Vector3(...position),
      _q.setFromEuler(_e.set(...rotation)),
      new THREE.Vector3(...scale)
    )
    
    const cleaned = clean(geometry)
    cleaned.applyMatrix4(_m)
    parts.push(cleaned)
  }

  const createSphere = () => new THREE.SphereGeometry(1, 36, 24)

  add(createSphere(), [0, 0.78, 0], [0.62, 0.78, 0.56])     // Body
  add(createSphere(), [0, 0.7, 0.2], [0.46, 0.6, 0.4])       // Belly
  add(createSphere(), [0, 1.7, 0.02], [0.5, 0.47, 0.46])     // Head
  add(createSphere(), [0, 1.63, 0.44], [0.11, 0.065, 0.13])  // Beak

  ;[-1, 1].forEach((side) => {
    add(createSphere(), [side * 0.6, 0.88, 0], [0.12, 0.42, 0.22], [0, 0, side * 0.5]) // Flipper
    add(createSphere(), [side * 0.2, 0.04, 0.24], [0.18, 0.07, 0.26])                  // Foot
    add(new THREE.CylinderGeometry(0.19, 0.19, 0.16, 24), [side * 0.5, 1.68, 0], [1, 1, 1], [0, 0, Math.PI / 2]) // Ear cup
  })

  add(new THREE.TorusGeometry(0.52, 0.055, 10, 48, Math.PI), [0, 1.7, 0]) // Headband

  const merged = mergeGeometries(parts)

  parts.forEach((p) => p.dispose())

  return merged
}

export function geometryFromScene(scene, height = 2.1) {
  scene.updateWorldMatrix(true, true)
  const parts = []

  scene.traverse((object) => {
    if (object.isMesh && object.geometry) {
      const clonedGeo = object.geometry.clone()
      clonedGeo.applyMatrix4(object.matrixWorld)
      parts.push(clean(clonedGeo))
    }
  })

  if (parts.length === 0) {
    console.warn('geometryFromScene: No valid meshes found in scene.')
    return new THREE.BufferGeometry()
  }

  const merged = mergeGeometries(parts)

  parts.forEach((p) => p.dispose())

  merged.computeBoundingBox()
  const box = merged.boundingBox
  const sizeY = box.max.y - box.min.y
  const scale = sizeY > 0 ? height / sizeY : 1

  const center = box.getCenter(new THREE.Vector3())
  merged.translate(-center.x, -box.min.y, -center.z)
  merged.scale(scale, scale, scale)

  return merged
}


export function samplePointCloud(geometry, count) {
  const tempMesh = new THREE.Mesh(geometry)
  const sampler = new MeshSurfaceSampler(tempMesh).build()
  const rand = createRng(77)

  const positions = new Float32Array(count * 3)
  const normals = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const seeds = new Float32Array(count)

  const samplePos = new THREE.Vector3()
  const sampleNorm = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    sampler.sample(samplePos, sampleNorm)

    samplePos.toArray(positions, i * 3)
    sampleNorm.toArray(normals, i * 3)

    const dist = 2.5 + rand() * 7.5
    const theta = rand() * Math.PI * 2
    const phi = (rand() - 0.5) * Math.PI

    scatter[i * 3] = samplePos.x + Math.cos(theta) * Math.cos(phi) * dist
    scatter[i * 3 + 1] = samplePos.y + Math.sin(phi) * dist + (rand() - 0.3) * 3
    scatter[i * 3 + 2] = samplePos.z + Math.sin(theta) * Math.cos(phi) * dist

    seeds[i] = rand()
  }

  tempMesh.geometry.dispose()

  const cloud = new THREE.BufferGeometry()
  cloud.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  cloud.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  cloud.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
  cloud.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

  return cloud
}