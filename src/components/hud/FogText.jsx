import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { FOG_WORDS } from '../../config/content'
import { sceneState } from '../../store/sceneState'


export default function FogText() {
  const layer = useRef(null)
  const words = useRef([])

  useEffect(() => {
    let lastOpacity = -1
    const tick = () => {
      const { hero, showcase } = sceneState.fx
      const opacity = Math.max(0, (1 - hero) * (1 - showcase))
      if (Math.abs(opacity - lastOpacity) > 0.002 && layer.current) {
        layer.current.style.opacity = opacity.toFixed(3)
        lastOpacity = opacity
      }
      if (opacity <= 0) return
      const p = sceneState.progress
      words.current.forEach((el, i) => {
        if (!el) return
        const depth = 0.4 + (i % 3) * 0.35
        el.style.transform = `translate3d(${Math.sin(p * 6 + i) * 30 * depth}px, ${-p * 900 * depth}px, 0)`
      })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div ref={layer} className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-0" aria-hidden="true">
      {FOG_WORDS.map((word, i) => (
        <span
          key={word.text}
          ref={(el) => {
            words.current[i] = el
          }}
          className="absolute whitespace-nowrap font-mono font-bold uppercase tracking-[0.3em] text-white/40 blur-[2px] will-change-transform"
          style={{ left: `${word.x}%`, top: `${word.y + i * 18}%`, fontSize: `${word.size}vw` }}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}
