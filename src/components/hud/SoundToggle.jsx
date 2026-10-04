export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      className="pointer-events-auto group flex items-center gap-2 text-white/90 transition hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {enabled ? (
          <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" strokeLinecap="round" />
        ) : (
          <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
        )}
      </svg>
      <span>Sound: {enabled ? 'On' : 'Off'}</span>
      <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] bg-current ${enabled ? 'animate-eq' : 'h-[2px]'}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
    </button>
  )
}
