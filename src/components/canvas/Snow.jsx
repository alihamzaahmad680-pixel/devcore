import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer } from '../../store/sceneState'
import { damp } from '../../utils/math'

const BOX = 22 // size of the snow volume that wraps around the camera

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform vec3 uCamera;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    // Fall + sway, then wrap the volume around the camera so snow is everywhere.
    p.y -= uTime * (0.25 + aSeed * 0.35);
    p.x += sin(uTime * 0.4 + aSeed * 40.0) * 0.6;
    p.z += cos(uTime * 0.3 + aSeed * 23.0) * 0.4;
    p = mod(p - uCamera + ${(BOX / 2).toFixed(1)}, ${BOX.toFixed(1)}) - ${(BOX / 2).toFixed(1)} + uCamera;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    // Cursor repulsion in screen space.
    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uMouse;
    float f = smoothstep(0.28, 0.0, length(d));
    clip.xy += normalize(d + 1e-5) * f * 0.09 * clip.w;

    gl_Position = clip;
    // Slightly reduced particle size to eliminate harsh screen glare
    gl_PointSize = (8.0 + aSeed * 14.0) * uPixelRatio / -mv.z;
    vAlpha = (0.25 + aSeed * 0.45) * smoothstep(0.3, 2.0, -mv.z) * (1.0 + f);
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vec3(0.95, 0.98, 1.0), a * vAlpha);
  }
`

export default function Snow({ count = 1800 }) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * BOX
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOX
      positions[i * 3 + 2] = (Math.random() - 0.5) * BOX
      seeds[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return g
  }, [count])

  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uMouse: { value: new THREE.Vector2() },
      uCamera: { value: new THREE.Vector3() },
    }),
    [],
  )

  useFrame(({ camera, viewport }, delta) => {
    uniforms.uTime.value += Math.min(delta, 0.1)
    uniforms.uPixelRatio.value = viewport.dpr
    uniforms.uCamera.value.copy(camera.position)
    const k = damp(6, delta)
    uniforms.uMouse.value.x += (pointer.x - uniforms.uMouse.value.x) * k
    uniforms.uMouse.value.y += (pointer.y - uniforms.uMouse.value.y) * k
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  )
}