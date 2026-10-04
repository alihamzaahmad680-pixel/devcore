/** Radar with a sweep (rotated by the HUD ticker from scroll velocity) and ping rings. */
export default function Radar({ sweepRef }) {
  return (
    <div className="relative size-12 overflow-hidden rounded-full border border-white/40 md:size-14" aria-hidden="true">
      <div
        ref={sweepRef}
        className="absolute inset-0 rounded-full will-change-transform"
        style={{ background: 'conic-gradient(from 0deg, rgba(255,255,255,0.7), rgba(255,255,255,0) 28%)' }}
      />
      <span className="absolute inset-x-0 top-1/2 h-px bg-white/30" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
      <span className="absolute inset-[30%] rounded-full border border-white/30" />
      {[0, 1].map((i) => (
        <span
          key={i}
          className="absolute inset-0 animate-radar-ping rounded-full border border-white"
          style={{ animationDelay: `${i * 1.5}s` }}
        />
      ))}
      <span className="absolute left-[64%] top-[30%] size-1 animate-pulse rounded-full bg-white" />
    </div>
  )
}
