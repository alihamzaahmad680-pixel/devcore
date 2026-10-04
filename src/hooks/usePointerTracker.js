import { useEffect } from 'react'
import { pointer } from '../store/sceneState'

/** Writes the normalized cursor position into the shared store (no re-renders). */
export function usePointerTracker() {
  useEffect(() => {
    const onMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}
