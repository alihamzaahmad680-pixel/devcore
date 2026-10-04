import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MODELS } from '../../config/models'
import { pointer, sceneState } from '../../store/sceneState'
import { damp } from '../../utils/math'
import { buildPenguinGeometry, geometryFromScene, samplePointCloud } from './characterGeometry'

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  attribute vec3 aScatter;
  attribute float aSeed;
  varying float vShade;

  void main() {
    // Stream from dust into the figure, each particle on its own schedule.
    float start = aSeed * 0.35;
    float t = smoothstep(start, start + 0.65, uProgress);
    vec3 p = mix(aScatter, position, t);

    // Living surface: a soft shimmer along the normal + a curl of drifting dust.
    p += normal * sin(uTime * 2.2 + aSeed * 60.0) * 0.012;
    p.y += (1.0 - t) * sin(uTime * 0.8 + aSeed * 12.0) * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    // Cursor blows particles off the surface.
    vec2 d = clip.xy / clip.w - uMouse;
    float f = smoothstep(0.22, 0.0, length(d));
    clip.xy += normalize(d + 1e-5) * f * 0.05 * clip.w * (0.5 + aSeed);

    gl_Position = clip;
    gl_PointSize = (1.0 + aSeed) * 15.0 * uPixelRatio / -mv.z;
    vShade = 0.5 + 0.5 * max(dot(normalize(normal), normalize(vec3(0.3, 1.0, 0.6))), 0.0);
  }
`

const fragmentShader = /* glsl */ `
  varying float vShade;
  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    gl_FragColor = vec4(vec3(0.58, 0.62, 0.67) * vShade * 1.25, 1.0);
  }
`

function PointCloud({ geometry, count }) {
  const group = useRef()
  const cloud = useMemo(() => samplePointCloud(geometry, count), [geometry, count])
  useEffect(() => () => cloud.dispose(), [cloud])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 },
      uMouse: { value: new THREE.Vector2() },
    }),
    [],
  )

  useFrame(({ clock, viewport }, delta) => {
    const t = clock.elapsedTime
    const k = damp(5, delta)
    uniforms.uTime.value = t
    uniforms.uPixelRatio.value = viewport.dpr
    uniforms.uProgress.value += (sceneState.fx.showcase - uniforms.uProgress.value) * damp(2.5, delta)
    uniforms.uMouse.value.x += (pointer.x - uniforms.uMouse.value.x) * k
    uniforms.uMouse.value.y += (pointer.y - uniforms.uMouse.value.y) * k

    // Hover above the pedestal, slowly turning to look around.
    group.current.position.y = 0.45 + Math.sin(t * 1.1) * 0.06
    group.current.rotation.y = Math.sin(t * 0.35) * 0.45 + pointer.x * 0.3
  })

  return (
    <group ref={group}>
      <points geometry={cloud} frustumCulled={false}>
        <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
      </points>
    </group>
  )
}

function ProceduralCharacter({ count }) {
  const geometry = useMemo(buildPenguinGeometry, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <PointCloud geometry={geometry} count={count} />
}

function GltfCharacter({ url, count }) {
  const { scene } = useGLTF(url)
  const geometry = useMemo(() => geometryFromScene(scene), [scene])
  useEffect(() => () => geometry.dispose(), [geometry])
  return <PointCloud geometry={geometry} count={count} />
}

if (MODELS.character) useGLTF.preload(MODELS.character)

export default function ParticleCharacter({ count = 16000 }) {
  return MODELS.character ? (
    <GltfCharacter url={MODELS.character} count={count} />
  ) : (
    <ProceduralCharacter count={count} />
  )
}
