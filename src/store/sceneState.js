import { useSyncExternalStore } from 'react'
import { KEYFRAMES } from '../config/scene'


const first = KEYFRAMES[0]
export const sceneState = {
  camera: { ...first.camera },
  target: { ...first.target },
  fx: { ...first.fx },
  progress: 0,
}

export const pointer = { x: 0, y: 0 }

export const overlayLayer = { current: null }

let activeSection = 0
const listeners = new Set()

export function setActiveSection(index) {
  if (index === activeSection) return
  activeSection = index
  listeners.forEach((listener) => listener())
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const getSnapshot = () => activeSection

export const useActiveSection = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
