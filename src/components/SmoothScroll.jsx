// import { createContext, useContext, useEffect, useState } from 'react'
// import Lenis from 'lenis'
// import { gsap, ScrollTrigger } from '../lib/gsap'

// const LenisContext = createContext(null)
// export const useLenis = () => useContext(LenisContext)


// export default function SmoothScroll({ children }) {
//   const [lenis, setLenis] = useState(null)

//   useEffect(() => {
//     const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
//     const instance = new Lenis({
//       lerp: 0.075,
//       smoothWheel: !reducedMotion,
//       wheelMultiplier: 0.85,
//       touchMultiplier: 1.4,
//     })

//     instance.on('scroll', ScrollTrigger.update)
//     const raf = (time) => instance.raf(time * 1000) // gsap time is seconds, Lenis wants ms
//     gsap.ticker.add(raf)
//     gsap.ticker.lagSmoothing(0)
//     setLenis(instance)

//     return () => {
//       gsap.ticker.remove(raf)
//       instance.destroy()
//       setLenis(null)
//     }
//   }, [])

//   return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
// }
import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

const LenisContext = createContext(null)
export const useLenis = () => useContext(LenisContext)

export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reducedMotion,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,  // Mobile swipe responsiveness boosted
      syncTouch: true,       // Syncs touch events directly on mobile
      smoothTouch: false,    // Native touch momentum on mobile for lag-free scrolling
    })

    // Connect Lenis scroll updates to GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update)

    const updateTicker = (time) => {
      instance.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(updateTicker)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}