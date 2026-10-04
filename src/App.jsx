// import { lazy, Suspense, useCallback, useState } from 'react'
// import SmoothScroll from './components/SmoothScroll'
// import HUDOverlay from './components/hud/HUDOverlay'
// import FogText from './components/hud/FogText'
// import ScrollSections from './components/sections/ScrollSections'
// import Preloader from './components/Preloader'
// import { usePointerTracker } from './hooks/usePointerTracker'
// import { overlayLayer } from './store/sceneState'

// const Scene3D = lazy(() => import('./components/canvas/Scene3D'))

// const setOverlayLayer = (el) => {
//   overlayLayer.current = el
// }

// export default function App() {
//   const [ready, setReady] = useState(false)
//   const handleReady = useCallback(() => setReady(true), [])
//   usePointerTracker()

//   return (
//     <SmoothScroll>
//       <div className="canvas-wrapper">
//         <Suspense fallback={null}>
//           <Scene3D onReady={handleReady} />
//         </Suspense>
//       </div>

//       <FogText />
//       <ScrollSections />
//       <div ref={setOverlayLayer} className="pointer-events-none fixed inset-0 z-30" />
//       <HUDOverlay />
//       <Preloader done={ready} />
//     </SmoothScroll>
//   )
// }
import { lazy, Suspense, useCallback, useState } from 'react'
import SmoothScroll from './components/SmoothScroll'
import HUDOverlay from './components/hud/HUDOverlay'
import FogText from './components/hud/FogText'
import ScrollSections from './components/sections/ScrollSections'
import Preloader from './components/Preloader'
import { usePointerTracker } from './hooks/usePointerTracker'
import { overlayLayer } from './store/sceneState'

const Scene3D = lazy(() => import('./components/canvas/Scene3D'))

const setOverlayLayer = (el) => {
  overlayLayer.current = el
}

export default function App() {
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])
  usePointerTracker()

  return (
    <SmoothScroll>
      <div className="canvas-wrapper pointer-events-none">
        <Suspense fallback={null}>
          <Scene3D onReady={handleReady} />
        </Suspense>
      </div>

      <FogText />
      <ScrollSections />
      <div ref={setOverlayLayer} className="pointer-events-none fixed inset-0 z-30" />
      <HUDOverlay />
      <Preloader done={ready} />
    </SmoothScroll>
  )
}