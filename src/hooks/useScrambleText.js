import { useEffect, useRef } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ'


export function useScrambleText(text, { delay = 0, duration = 1200 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = text
      return
    }
    let frame
    const start = performance.now() + delay
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration))
      const revealed = Math.floor(p * text.length)
      let out = text.slice(0, revealed)
      for (let i = revealed; i < text.length; i++) {
        out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      el.textContent = out
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text, delay, duration])

  return ref
}
