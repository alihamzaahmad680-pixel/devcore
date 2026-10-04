import * as THREE from 'three'
import { IGLOO } from '../../config/scene'
import { createRng } from '../../utils/math'

const GAP = 0.96 


export function buildIglooBlocks() {
  const rand = createRng(1337)
  const dummy = new THREE.Object3D()
  const blocks = []

  const push = (scale, normal) => {
    blocks.push({
      home: dummy.position.clone(),
      homeQ: dummy.quaternion.clone(),
      scale,
      normal,
    })
  }

  const { radius, rows, brick, depth, doorWidth, doorRows, tunnel } = IGLOO
  const arc = (Math.PI / 2) * 0.95
  const rowH = (radius * arc) / rows
  for (let row = 0; row < rows; row++) {
    const phi = ((row + 0.5) / rows) * arc
    const ringR = radius * Math.cos(phi)
    const y = radius * Math.sin(phi)
    const count = Math.max(4, Math.round((2 * Math.PI * ringR) / brick))
    const width = (2 * Math.PI * ringR) / count
    const stagger = row % 2 ? 0.5 : 0

    for (let i = 0; i < count; i++) {
      const theta = ((i + stagger) / count) * Math.PI * 2
      const fromDoor = Math.atan2(Math.sin(theta - Math.PI / 2), Math.cos(theta - Math.PI / 2))
      if (row < doorRows && Math.abs(fromDoor) < doorWidth) continue

      dummy.up.set(0, 1, 0)
      dummy.position.set(Math.cos(theta) * ringR, y, Math.sin(theta) * ringR)
      dummy.lookAt(0, 0, 0)
      const jitter = 0.97 + rand() * 0.04
      push(
        new THREE.Vector3(width * GAP * jitter, rowH * GAP * jitter, depth * (0.92 + rand() * 0.15)),
        dummy.position.clone().normalize(),
      )
    }
  }

  // Cap stone
  dummy.up.set(0, 0, 1)
  dummy.position.set(0, radius * 0.995, 0)
  dummy.lookAt(0, 0, 0)
  push(new THREE.Vector3(0.5, 0.5, depth), new THREE.Vector3(0, 1, 0))

  const tunnelStart = radius * 0.78
  const slice = tunnel.length / tunnel.rings
  const archWidth = (Math.PI * tunnel.radius) / tunnel.segments
  for (let ring = 0; ring < tunnel.rings; ring++) {
    const z = tunnelStart + (ring + 0.5) * slice
    for (let s = 0; s < tunnel.segments; s++) {
      const a = ((s + 0.5) / tunnel.segments) * Math.PI
      dummy.up.set(0, 0, 1)
      dummy.position.set(Math.cos(a) * tunnel.radius, Math.sin(a) * tunnel.radius, z)
      dummy.lookAt(0, 0, z)
      push(
        new THREE.Vector3(archWidth * GAP, slice * GAP, depth * 0.9),
        new THREE.Vector3(Math.cos(a), Math.sin(a), 0),
      )
    }
  }

  const euler = new THREE.Euler()
  for (const b of blocks) {
    const outward = 1.5 + rand() * 3
    b.explode = b.home
      .clone()
      .add(new THREE.Vector3(b.normal.x * outward, 7 + rand() * 14 + b.home.y * 3, b.normal.z * outward))
    euler.set(rand() * Math.PI * 2, rand() * Math.PI * 2, rand() * Math.PI)
    b.explodeQ = b.homeQ.clone().multiply(new THREE.Quaternion().setFromEuler(euler))
    b.delay = (1 - b.home.y / radius) * 0.3 + rand() * 0.1
    b.drift = rand() * Math.PI * 2
  }

  return blocks
}

export const TUNNEL_START = IGLOO.radius * 0.78