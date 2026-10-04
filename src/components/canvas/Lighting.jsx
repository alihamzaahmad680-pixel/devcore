import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { COLORS, PORTAL, STAGE } from '../../config/scene'
import { sceneState } from '../../store/sceneState'


export default function Lighting() {
  const white = useRef()
  const cyan = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (white.current) {
      white.current.position.set(Math.cos(t * 0.3) * 4, 3 + Math.sin(t * 0.5) * 0.5, Math.sin(t * 0.3) * 4 + 1)
    }
    if (cyan.current) {
      cyan.current.position.set(Math.cos(t * 0.4 + Math.PI) * 3.5, 2.4, Math.sin(t * 0.4 + Math.PI) * 3.5)
      cyan.current.intensity = 4 + sceneState.fx.explode * 10
    }
  })

  return (
    <>
      {/* Cool Sky & Ice Ground Ambient Fill (Eliminates Muddy Yellow Reflections) */}
      <hemisphereLight args={['#ffffff', '#b0bec5', 1.35]} />
      <ambientLight intensity={0.25} color="#e3f2fd" />

      {/* Main Arctic Sun Key Light */}
      <directionalLight
        castShadow
        position={[-6, 12, 7]}
        intensity={2.5}
        color="#ffffff"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />

      {/* Cool Rim Light for Frost Edges */}
      <directionalLight position={[5, 4, -9]} intensity={1.6} color="#dff6ff" />

      {/* Dynamic Animated Lights */}
      <pointLight ref={white} color={COLORS.glow} intensity={6} distance={12} decay={2} />
      <pointLight ref={cyan} color={COLORS.cyan} intensity={5} distance={10} decay={2} />

      {/* Portal core + showcase key light */}
      <pointLight position={PORTAL.position} color={COLORS.glow} intensity={30} distance={14} decay={2} />
      <pointLight
        position={[STAGE.position[0] + 2, STAGE.position[1] + 6, STAGE.position[2] + 3]}
        intensity={40}
        distance={18}
        decay={2}
      />

      <Environment resolution={256} frames={1} environmentIntensity={0.85}>
        <Lightformer form="rect" intensity={3.0} color="#ffffff" position={[0, 6, -6]} scale={[14, 4, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#e8f4ff" position={[-8, 2, 4]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer form="ring" intensity={2.5} color="#00e5ff" position={[6, 3, 4]} rotation-y={-Math.PI / 2} scale={4} />
        <Lightformer form="rect" intensity={1.0} color="#c4d8e2" position={[0, -6, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} />
      </Environment>
    </>
  )
}