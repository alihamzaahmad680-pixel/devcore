import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, sceneState } from '../../store/sceneState'
import { damp } from '../../utils/math'

export const focusPoint = new THREE.Vector3(0, 1.2, 0)

const desiredPosition = new THREE.Vector3()
const targetFocus = new THREE.Vector3()
const currentRoll = { value: 0 }

export default function CameraRig() {
  useFrame(({ camera, clock }, delta) => {
    const safeDelta = Math.min(delta, 0.1)
    
    const { camera: c, target: t, fx } = sceneState
    const k = damp(3.5, safeDelta)

    const elapsedTime = clock.getElapsedTime()
    const idleSwayX = Math.sin(elapsedTime * 0.8) * 0.08
    const idleSwayY = Math.cos(elapsedTime * 0.6) * 0.05

    desiredPosition.set(
      c.x + pointer.x * 0.45 + idleSwayX,
      c.y + pointer.y * 0.25 + idleSwayY,
      c.z
    )

    camera.position.lerp(desiredPosition, k)

    targetFocus.set(t.x, t.y, t.z)
    focusPoint.lerp(targetFocus, k)
    camera.lookAt(focusPoint)

    currentRoll.value += (fx.roll - currentRoll.value) * k
    camera.rotation.z = currentRoll.value

    if (Math.abs(camera.fov - fx.fov) > 0.001) {
      camera.fov += (fx.fov - camera.fov) * k
      camera.updateProjectionMatrix()
    }
  })

  return null
}