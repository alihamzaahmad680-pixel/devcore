import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { MANIFESTO, SECTIONS } from '../../config/content'
import { useAmbientSound } from '../../hooks/useAmbientSound'
import { useScrambleText } from '../../hooks/useScrambleText'
import { pointer, sceneState, useActiveSection } from '../../store/sceneState'
import { useLenis } from '../SmoothScroll'
import Radar from './Radar'
import SoundToggle from './SoundToggle'

const fmt = (n) => `${n >= 0 ? '+' : '-'}${Math.abs(n).toFixed(3)}`

export default function HUDOverlay() {
  const lenis = useLenis()
  const active = useActiveSection()
  const { enabled, toggle, ping } = useAmbientSound()

  const heroRefs = useRef([])
  const coordsRef = useRef(null)
  const camRef = useRef(null)
  const progressRef = useRef(null)
  const barRef = useRef(null)
  const sweepRef = useRef(null)
  const lenisRef = useRef(lenis)

  const manifestoRef = useScrambleText(MANIFESTO, { delay: 900, duration: 1800 })

  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  useEffect(() => ping(), [active, ping])

  useEffect(() => {
    const smooth = { x: 0, y: 0 }
    const last = {}
    let angle = 0
    const write = (key, el, text) => {
      if (el && last[key] !== text) {
        last[key] = text
        el.textContent = text
      }
    }

    const tick = (_time, deltaMs) => {
      const k = 1 - Math.exp(-deltaMs * 0.008)
      smooth.x += (pointer.x - smooth.x) * k
      smooth.y += (pointer.y - smooth.y) * k
      write('xy', coordsRef.current, `X ${fmt(smooth.x)}  Y ${fmt(smooth.y)}`)

      const c = sceneState.camera
      write('cam', camRef.current, `CAM ${c.x.toFixed(1)} / ${c.y.toFixed(1)} / ${c.z.toFixed(1)}`)
      write('pct', progressRef.current, `${String(Math.round(sceneState.progress * 100)).padStart(3, '0')}%`)
      if (barRef.current) barRef.current.style.transform = `scaleY(${sceneState.progress})`

      const hero = sceneState.fx.hero.toFixed(3)
      if (last.hero !== hero) {
        last.hero = hero
        heroRefs.current.forEach((el) => el && (el.style.opacity = hero))
      }

      const velocity = Math.abs(lenisRef.current?.velocity ?? 0)
      angle = (angle + deltaMs * (0.12 + Math.min(velocity, 80) * 0.02)) % 360
      if (sweepRef.current) sweepRef.current.style.transform = `rotate(${angle}deg)`
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  const goTo = (index) => {
    const target = `#section-${SECTIONS[index].id}`
    if (lenis) lenis.scrollTo(target, { duration: 2.2 })
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  const setHeroRef = (i) => (el) => {
    heroRefs.current[i] = el
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex select-none flex-col justify-between p-5 font-mono text-[10px] uppercase tracking-[0.12em] text-white md:p-8 md:text-[11px] [text-shadow:0_0_10px_rgba(60,70,80,0.35)]">
      {/* Top bar */}
      <header className="flex items-start justify-between gap-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-none tracking-[0.04em] md:text-[2.6rem]">
            Devcore
          </h1>
          <div ref={setHeroRef(0)} className="mt-4 space-y-3 normal-case">
            <p className="leading-relaxed text-white/85">
              Devcore, Inc.
              <br />
              All Rights Reserved.
            </p>
          </div>
        </div>

        <div ref={setHeroRef(1)} className="hidden max-w-[210px] text-right sm:block">
          <p className="tracking-[0.2em] text-white/85">////// Manifesto</p>
          <p ref={manifestoRef} className="mt-4 normal-case leading-[1.45] tracking-[0.06em] text-white/90" />
        </div>
      </header>

      {/* Right rail: progress + section navigation */}
      <nav className="absolute right-5 top-1/2 flex -translate-y-1/2 items-center gap-3 md:right-8" aria-label="Sections">
        <span className="relative hidden h-32 w-px bg-white/25 md:block">
          <span ref={barRef} className="absolute inset-0 origin-top bg-white" style={{ transform: 'scaleY(0)' }} />
        </span>
        <ul className="flex flex-col gap-3">
          {SECTIONS.map((section, i) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${section.label}`}
                aria-current={active === i ? 'step' : undefined}
                className={`pointer-events-auto block size-2 rotate-45 border border-white transition-all duration-500 hover:scale-150 hover:shadow-[0_0_12px_rgba(255,255,255,0.9)] ${
                  active === i ? 'scale-125 bg-white' : 'bg-transparent'
                }`}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom bar */}
      <footer className="flex items-end justify-between gap-6">
        <SoundToggle enabled={enabled} onToggle={toggle} />

        <div className="hidden text-center text-white/80 md:block">
          <p key={active} className="animate-hud-in tracking-[0.25em]">
            {String(active + 1).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')} — {SECTIONS[active].label}
          </p>
          <p ref={progressRef} className="mt-1 text-white/60">
            000%
          </p>
        </div>

        <div className="flex items-end gap-3 text-right text-white/80">
          <div className="hidden leading-relaxed sm:block">
            <p ref={coordsRef}>X +0.000  Y +0.000</p>
            <p ref={camRef} className="text-white/60" />
          </div>
          <Radar sweepRef={sweepRef} />
        </div>
      </footer>
    </div>
  )
}