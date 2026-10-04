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
      lerp: 0.075,
      smoothWheel: !reducedMotion,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
    })

    instance.on('scroll', ScrollTrigger.update)
    const raf = (time) => instance.raf(time * 1000) // gsap time is seconds, Lenis wants ms
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
