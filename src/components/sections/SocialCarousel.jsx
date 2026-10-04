import { useState } from 'react'
import { SOCIAL_LINKS } from '../../config/content'

const Corner = ({ className }) => <span className={`absolute size-2 border-white ${className}`} aria-hidden="true" />

export default function SocialCarousel() {
  const [index, setIndex] = useState(0)
  const link = SOCIAL_LINKS[index]
  const step = (dir) => setIndex((i) => (i + dir + SOCIAL_LINKS.length) % SOCIAL_LINKS.length)

  return (
    <>
      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous link"
        className="absolute left-[18%] top-1/2 -translate-y-1/2 p-3 text-white/80 transition hover:-translate-x-1 hover:text-white md:left-[30%]"
      >
        <span className="block h-px w-10 bg-current" />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next link"
        className="absolute right-[18%] top-1/2 -translate-y-1/2 p-3 text-white/80 transition hover:translate-x-1 hover:text-white md:right-[30%]"
      >
        <span className="block h-px w-10 bg-current" />
      </button>

      <div className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 items-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-white">
        <span className="text-white/50">{String(index + 1).padStart(2, '0')}</span>
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="group relative animate-hud-in px-7 py-3 normal-case tracking-[0.15em] transition hover:[text-shadow:0_0_12px_rgba(255,255,255,0.9)]"
        >
          <Corner className="left-0 top-0 border-l border-t transition-all group-hover:-left-1 group-hover:-top-1" />
          <Corner className="right-0 top-0 border-r border-t transition-all group-hover:-right-1 group-hover:-top-1" />
          <Corner className="bottom-0 left-0 border-b border-l transition-all group-hover:-bottom-1 group-hover:-left-1" />
          <Corner className="bottom-0 right-0 border-b border-r transition-all group-hover:-bottom-1 group-hover:-right-1" />
          {link.label}
        </a>
        <button type="button" onClick={() => step(1)} className="text-white/60 transition hover:text-white" aria-label="Next link">
          {SOCIAL_LINKS[(index + 1) % SOCIAL_LINKS.length].label} /
        </button>
      </div>
    </>
  )
}
