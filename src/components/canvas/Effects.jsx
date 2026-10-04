import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { sceneState } from '../../store/sceneState'
import { focusPoint } from './CameraRig'


export default function Effects({ quality = 'high' }) {
  const chroma = useRef()
  const offset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])
  const high = quality === 'high'

  useFrame(() => {
    if (chroma.current) {
      const { explode, ring } = sceneState.fx
      const burst = Math.sin(Math.PI * explode) + Math.sin(Math.PI * ring) * 0.6
      const amount = 0.0005 + burst * 0.0015
      chroma.current.offset.set(amount, amount * 0.6)
    }
  })

  return (
    <EffectComposer multisampling={high ? 4 : 0}>
     
      <Bloom 
  mipmapBlur 
  luminanceThreshold={0.6} 
  luminanceSmoothing={0.2} 
  intensity={1.5} 
  radius={0.6} 
/>
      
      
      <ChromaticAberration ref={chroma} offset={offset} radialModulation modulationOffset={0.25} />
      <Vignette offset={0.4} darkness={0.25} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
    </EffectComposer>
  )
}