import { useRef } from 'react'
import { SECTIONS } from '../../config/content'
import { useScrollTimeline } from '../../hooks/useScrollTimeline'
import SocialCarousel from './SocialCarousel'


export default function ScrollSections() {
  const container = useRef(null)
  useScrollTimeline(container)

  return (
    <main ref={container} className="relative z-10">
      {SECTIONS.map((section, i) => (
        <section
          key={section.id}
          id={`section-${section.id}`}
          aria-label={section.label}
          className="relative h-screen w-full"
        >
          <h2 className="sr-only">{section.label}</h2>
          {i === SECTIONS.length - 1 && <SocialCarousel />}
        </section>
      ))}
    </main>
  )
}
