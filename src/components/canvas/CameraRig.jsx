// import { useFrame } from '@react-three/fiber'
// import * as THREE from 'three'
// import { pointer, sceneState } from '../../store/sceneState'
// import { damp } from '../../utils/math'

// export const focusPoint = new THREE.Vector3(0, 1.2, 0)

// const desiredPosition = new THREE.Vector3()
// const targetFocus = new THREE.Vector3()
// const currentRoll = { value: 0 }

// export default function CameraRig() {
//   useFrame(({ camera, clock }, delta) => {
//     const safeDelta = Math.min(delta, 0.1)
    
//     const { camera: c, target: t, fx } = sceneState
//     const k = damp(3.5, safeDelta)

//     const elapsedTime = clock.getElapsedTime()
//     const idleSwayX = Math.sin(elapsedTime * 0.8) * 0.08
//     const idleSwayY = Math.cos(elapsedTime * 0.6) * 0.05

//     desiredPosition.set(
//       c.x + pointer.x * 0.45 + idleSwayX,
//       c.y + pointer.y * 0.25 + idleSwayY,
//       c.z
//     )

//     camera.position.lerp(desiredPosition, k)

//     targetFocus.set(t.x, t.y, t.z)
//     focusPoint.lerp(targetFocus, k)
//     camera.lookAt(focusPoint)

//     currentRoll.value += (fx.roll - currentRoll.value) * k
//     camera.rotation.z = currentRoll.value

//     if (Math.abs(camera.fov - fx.fov) > 0.001) {
//       camera.fov += (fx.fov - camera.fov) * k
//       camera.updateProjectionMatrix()
//     }
//   })

//   return null
// }
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, sceneState } from '../../store/sceneState'
import { damp } from '../../utils/math'

export const focusPoint = new THREE.Vector3(0, 1.2, 0)

const desiredPosition = new THREE.Vector3()
const targetFocus = new THREE.Vector3()
const currentRoll = { value: 0 }

export default function CameraRig() {
  const { size } = useThree()
  
  useFrame(({ camera, clock }, delta) => {
    const safeDelta = Math.min(delta, 0.1)
    const isSmallScreen = size.width < 768
    
    const { camera: c, target: t, fx } = sceneState
    // Mobile par lerp damp speed thodi smooth rakhi hai
    const k = damp(isSmallScreen ? 2.8 : 3.5, safeDelta)

    const elapsedTime = clock.getElapsedTime()
    
    // Idle sway mobile par reduce rakhi hai taakay touch jitter na ho
    const swayMultiplier = isSmallScreen ? 0.3 : 1
    const idleSwayX = Math.sin(elapsedTime * 0.8) * 0.08 * swayMultiplier
    const idleSwayY = Math.cos(elapsedTime * 0.6) * 0.05 * swayMultiplier

    // Pointer influence scaling for mobile touch coordinates
    const pointerXScale = isSmallScreen ? 0.15 : 0.45
    const pointerYScale = isSmallScreen ? 0.1 : 0.25

    desiredPosition.set(
      c.x + pointer.x * pointerXScale + idleSwayX,
      c.y + pointer.y * pointerYScale + idleSwayY,
      c.z
    )

    camera.position.lerp(desiredPosition, k)

    targetFocus.set(t.x, t.y, t.z)
    focusPoint.lerp(targetFocus, k)
    camera.lookAt(focusPoint)

    currentRoll.value += (fx.roll - currentRoll.value) * k
    camera.rotation.z = currentRoll.value

    // Dynamic FOV adjustment based on screen size
    const targetFov = isSmallScreen ? Math.min(fx.fov * 1.3, 65) : fx.fov

    if (Math.abs(camera.fov - targetFov) > 0.001) {
      camera.fov += (targetFov - camera.fov) * k
      camera.updateProjectionMatrix()
    }
  })

  return null
}