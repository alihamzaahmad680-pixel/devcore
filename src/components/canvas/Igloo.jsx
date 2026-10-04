// import { useRef, useMemo } from 'react'
// import { useFrame } from '@react-three/fiber'
// import { Float, MeshTransmissionMaterial, Sparkles, Instances, Instance } from '@react-three/drei'
// import * as THREE from 'three'
// import { pointer, sceneState } from '../../store/sceneState'

// export default function Igloo() {
//   const mainGroup = useRef()
//   const outerRing1 = useRef()
//   const outerRing2 = useRef()
//   const coreRef = useRef()
//   const floatMeshGroup = useRef()

//   // Generate dynamic array for procedural orbiting structural panels
//   const panelCount = 18
//   const panelsData = useMemo(() => {
//     return Array.from({ length: panelCount }, (_, i) => {
//       const angle = (i / panelCount) * Math.PI * 2
//       const radius = 2.8 + (i % 3) * 0.4
//       return {
//         initialPos: [
//           Math.cos(angle) * radius,
//           (i % 5 - 2) * 0.6,
//           Math.sin(angle) * radius
//         ],
//         rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
//         speed: 0.3 + Math.random() * 0.5,
//         scale: [0.4 + Math.random() * 0.4, 0.6 + Math.random() * 0.8, 0.08]
//       }
//     })
//   }, [])

//   useFrame(({ clock }, delta) => {
//     const t = clock.elapsedTime
//     const { explode } = sceneState.fx

//     // Dynamic Cursor Tracking & Kinetic Inertia
//     if (mainGroup.current) {
//       mainGroup.current.rotation.y = THREE.MathUtils.lerp(
//         mainGroup.current.rotation.y,
//         t * 0.2 + pointer.x * 0.8,
//         0.05
//       )
//       mainGroup.current.rotation.x = THREE.MathUtils.lerp(
//         mainGroup.current.rotation.x,
//         pointer.y * 0.5,
//         0.05
//       )
//     }

//     // Inner Energetic Core Pulsation & Morphing Rotation
//     if (coreRef.current) {
//       coreRef.current.rotation.x = t * 0.8
//       coreRef.current.rotation.z = t * 0.5
//       const pulse = 1 + Math.sin(t * 3) * 0.08
//       coreRef.current.scale.setScalar(pulse)
//     }

//     // Outer Gyroscope HUD Rings
//     if (outerRing1.current) {
//       outerRing1.current.rotation.x = t * 0.5
//       outerRing1.current.rotation.y = t * 0.3
//     }
//     if (outerRing2.current) {
//       outerRing2.current.rotation.y = -t * 0.6
//       outerRing2.current.rotation.z = t * 0.4
//     }

//     // Interactive Explode / Assembly Dispersal Logic
//     if (floatMeshGroup.current) {
//       floatMeshGroup.current.children.forEach((child, idx) => {
//         const p = panelsData[idx]
//         if (p && child) {
//           const scatterFactor = 1 + explode * 3.5
//           child.position.x = THREE.MathUtils.lerp(child.position.x, p.initialPos[0] * scatterFactor, 0.08)
//           child.position.y = THREE.MathUtils.lerp(child.position.y, p.initialPos[1] * scatterFactor + Math.sin(t * p.speed + idx) * 0.2, 0.08)
//           child.position.z = THREE.MathUtils.lerp(child.position.z, p.initialPos[2] * scatterFactor, 0.08)
//           child.rotation.x += delta * p.speed * (1 + explode)
//           child.rotation.y += delta * p.speed * 0.8
//         }
//       })
//     }
//   })

//   return (
//     <group position={[0, 0.8, 0]}>
//       <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.8}>
//         <group ref={mainGroup} scale={1.2}>

//           {/* 1. HIGH-END TRANSMISSION GLASS CRYSTAL CORE */}
//           <mesh>
//             <octahedronGeometry args={[1.5, 2]} />
//             <MeshTransmissionMaterial
//               transmission={0.96}
//               roughness={0.08}
//               ior={1.6}
//               thickness={1.5}
//               chromaticAberration={0.6} // Realistic Prism Spectrum Effect
//               anisotropy={0.4}
//               distortion={0.4}
//               distortionScale={0.6}
//               temporalDistortion={0.15}
//               color="#38bdf8"
//               attenuationColor="#0284c7"
//               attenuationDistance={2.5}
//             />
//           </mesh>

//           {/* 2. INNER GLOWING CYBER POLYGON CORE */}
//           <mesh ref={coreRef} scale={0.75}>
//             <icosahedronGeometry args={[1, 1]} />
//             <meshStandardMaterial
//               color="#00f0ff"
//               emissive="#00f0ff"
//               emissiveIntensity={3.5}
//               wireframe
//               toneMapped={false}
//             />
//           </mesh>

//           {/* Inner Point Light Emission */}
//           <pointLight color="#00f0ff" intensity={8} distance={10} decay={2} />

//           {/* 3. ORBITING ARCHITECTURAL PANELS (PROCEDURAL ASSEMBLY) */}
//           <group ref={floatMeshGroup}>
//             {panelsData.map((item, i) => (
//               <mesh key={i} position={item.initialPos} rotation={item.rot} scale={item.scale}>
//                 <boxGeometry args={[1, 1, 1]} />
//                 <meshPhysicalMaterial
//                   color={i % 2 === 0 ? '#0284c7' : '#0f172a'}
//                   metalness={0.8}
//                   roughness={0.2}
//                   clearcoat={1}
//                   clearcoatRoughness={0.1}
//                   reflectivity={0.9}
//                 />
//               </mesh>
//             ))}
//           </group>

//           {/* 4. GYROSCOPIC HUD TECH RINGS */}
//           <group ref={outerRing1}>
//             <mesh>
//               <torusGeometry args={[3.2, 0.018, 16, 120]} />
//               <meshStandardMaterial
//                 color="#00f0ff"
//                 emissive="#00f0ff"
//                 emissiveIntensity={2.5}
//                 toneMapped={false}
//               />
//             </mesh>
//           </group>

//           <group ref={outerRing2}>
//             <mesh rotation-x={Math.PI / 3}>
//               <torusGeometry args={[3.6, 0.012, 16, 120]} />
//               <meshStandardMaterial
//                 color="#38bdf8"
//                 emissive="#38bdf8"
//                 emissiveIntensity={2}
//                 toneMapped={false}
//               />
//             </mesh>
//           </group>

//           <Sparkles
//             count={70}
//             scale={[8, 8, 8]}
//             size={3.5}
//             speed={0.8}
//             color="#00f0ff"
//             noise={0.5}
//           />
//         </group>
//       </Float>
//     </group>
//   )
// }
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { pointer, sceneState } from '../../store/sceneState'

export default function Igloo() {
  const { viewport, size } = useThree()
  const isMobile = size.width < 768

  const mainGroup = useRef()
  const outerRing1 = useRef()
  const outerRing2 = useRef()
  const coreRef = useRef()
  const floatMeshGroup = useRef()

  // Generate dynamic array for procedural orbiting structural panels
  const panelCount = isMobile ? 10 : 18 // Reduced geometry count for smooth mobile rendering
  const panelsData = useMemo(() => {
    return Array.from({ length: panelCount }, (_, i) => {
      const angle = (i / panelCount) * Math.PI * 2
      const radius = 2.8 + (i % 3) * 0.4
      return {
        initialPos: [
          Math.cos(angle) * radius,
          (i % 5 - 2) * 0.6,
          Math.sin(angle) * radius
        ],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        speed: 0.3 + Math.random() * 0.5,
        scale: [0.4 + Math.random() * 0.4, 0.6 + Math.random() * 0.8, 0.08]
      }
    })
  }, [panelCount])

  // Responsive scale factor based on screen viewport width
  const responsiveScale = useMemo(() => {
    if (size.width < 480) return 0.62 // Extra small mobile screens
    if (size.width < 768) return 0.78 // Tablets & standard phones
    return 1.2 // Desktop
  }, [size.width])

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    const { explode } = sceneState.fx

    // Dynamic Cursor & Touch Tracking
    if (mainGroup.current) {
      const pointerStrengthX = isMobile ? 0.3 : 0.8
      const pointerStrengthY = isMobile ? 0.2 : 0.5

      mainGroup.current.rotation.y = THREE.MathUtils.lerp(
        mainGroup.current.rotation.y,
        t * 0.2 + pointer.x * pointerStrengthX,
        0.05
      )
      mainGroup.current.rotation.x = THREE.MathUtils.lerp(
        mainGroup.current.rotation.x,
        pointer.y * pointerStrengthY,
        0.05
      )
    }

    // Inner Core Pulsation
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.8
      coreRef.current.rotation.z = t * 0.5
      const pulse = 1 + Math.sin(t * 3) * 0.08
      coreRef.current.scale.setScalar(pulse)
    }

    // Outer Gyroscope HUD Rings
    if (outerRing1.current) {
      outerRing1.current.rotation.x = t * 0.5
      outerRing1.current.rotation.y = t * 0.3
    }
    if (outerRing2.current) {
      outerRing2.current.rotation.y = -t * 0.6
      outerRing2.current.rotation.z = t * 0.4
    }

    // Explode Dispersal Logic
    if (floatMeshGroup.current) {
      floatMeshGroup.current.children.forEach((child, idx) => {
        const p = panelsData[idx]
        if (p && child) {
          const scatterFactor = 1 + explode * (isMobile ? 2.2 : 3.5)
          child.position.x = THREE.MathUtils.lerp(child.position.x, p.initialPos[0] * scatterFactor, 0.08)
          child.position.y = THREE.MathUtils.lerp(child.position.y, p.initialPos[1] * scatterFactor + Math.sin(t * p.speed + idx) * 0.2, 0.08)
          child.position.z = THREE.MathUtils.lerp(child.position.z, p.initialPos[2] * scatterFactor, 0.08)
          child.rotation.x += delta * p.speed * (1 + explode)
          child.rotation.y += delta * p.speed * 0.8
        }
      })
    }
  })

  return (
    <group position={[0, isMobile ? 0.4 : 0.8, 0]}>
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <group ref={mainGroup} scale={responsiveScale}>

          {/* 1. TRANSMISSION GLASS CRYSTAL CORE */}
          <mesh>
            <octahedronGeometry args={[1.5, 2]} />
            <MeshTransmissionMaterial
              transmission={0.96}
              roughness={0.08}
              ior={1.6}
              thickness={isMobile ? 0.8 : 1.5}
              chromaticAberration={isMobile ? 0.2 : 0.6}
              anisotropy={0.4}
              distortion={isMobile ? 0.2 : 0.4}
              distortionScale={0.6}
              temporalDistortion={0.15}
              color="#38bdf8"
              attenuationColor="#0284c7"
              attenuationDistance={2.5}
              resolution={isMobile ? 256 : 512}
            />
          </mesh>

          {/* 2. INNER GLOWING CYBER POLYGON CORE */}
          <mesh ref={coreRef} scale={0.75}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={3.5}
              wireframe
              toneMapped={false}
            />
          </mesh>

          {/* Inner Light Emission */}
          <pointLight color="#00f0ff" intensity={isMobile ? 5 : 8} distance={10} decay={2} />

          {/* 3. ORBITING ARCHITECTURAL PANELS */}
          <group ref={floatMeshGroup}>
            {panelsData.map((item, i) => (
              <mesh key={i} position={item.initialPos} rotation={item.rot} scale={item.scale}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                  color={i % 2 === 0 ? '#0284c7' : '#0f172a'}
                  metalness={0.8}
                  roughness={0.2}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  reflectivity={0.9}
                />
              </mesh>
            ))}
          </group>

          {/* 4. GYROSCOPIC HUD TECH RINGS */}
          <group ref={outerRing1}>
            <mesh>
              <torusGeometry args={[3.2, 0.018, 16, 120]} />
              <meshStandardMaterial
                color="#00f0ff"
                emissive="#00f0ff"
                emissiveIntensity={2.5}
                toneMapped={false}
              />
            </mesh>
          </group>

          <group ref={outerRing2}>
            <mesh rotation-x={Math.PI / 3}>
              <torusGeometry args={[3.6, 0.012, 16, 120]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          </group>

          <Sparkles
            count={isMobile ? 35 : 70}
            scale={[8, 8, 8]}
            size={3.5}
            speed={0.8}
            color="#00f0ff"
            noise={0.5}
          />
        </group>
      </Float>
    </group>
  )
}