
import { useState } from 'react'

export default function Preloader({ done }) {
  const [gone, setGone] = useState(false)
  if (gone) return null

  return (
    <div
      onTransitionEnd={() => done && setGone(true)}
      className={`fixed inset-0 z-50 grid place-items-center bg-[#0a0f1d] transition-all duration-[1200ms] ease-out ${
        done ? 'pointer-events-none opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      <div className="text-center text-white">
        {/* Animated Cyber Core Ring */}
        <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-pulse" />
        </div>

        {/* Aapka Name / Brand Title */}
        <p className="font-display text-4xl font-black tracking-[0.1em] text-white uppercase">
          ALI HAMZA
        </p>
        
        <p className="mt-2 font-mono text-xs tracking-[0.25em] text-cyan-400/80 uppercase">
          Initializing System...
        </p>

        {/* Smooth Loading Bar */}
        <div className="mx-auto mt-6 h-px w-48 overflow-hidden bg-white/20">
          <span className="block h-full w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-loader" />
        </div>
      </div>
    </div>
  )
}