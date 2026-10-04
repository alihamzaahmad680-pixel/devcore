import * as THREE from 'three'
import { createRng } from './math'

export function createPuffTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const rand = createRng(99)
  const half = size / 2

  for (let i = 0; i < 26; i++) {
    const angle = rand() * Math.PI * 2
    const dist = rand() * half * 0.45
    const x = half + Math.cos(angle) * dist
    const y = half + Math.sin(angle) * dist * 0.7
    const r = half * (0.25 + rand() * 0.35)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.22)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
