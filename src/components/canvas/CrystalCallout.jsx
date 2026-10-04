export default function CrystalCallout({ item }) {
  return (
    <div className="pointer-events-none relative select-none font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-white [text-shadow:0_0_8px_rgba(0,0,0,0.25)]">
      {/* Title block */}
      <div className="absolute -left-[210px] -top-[165px] w-[180px] rounded-sm border border-white/10 bg-white/5 px-2 py-1.5 backdrop-blur-md">
        <p>{item.tag}</p>
        <p className="font-bold">{item.name}</p>
      </div>
      <span className="absolute -left-[60px] -top-[128px] block h-px w-[95px] origin-left rotate-[38deg] bg-white/70" />

      {/* Coordinates */}
      <div className="absolute -top-[110px] left-[95px] flex gap-2">
        <span>TEMP</span>
        <span className="text-right">
          {item.temp[0]}
          <br />
          {item.temp[1]}
        </span>
      </div>
      <span className="absolute -top-[96px] left-[30px] block h-px w-[60px] origin-left -rotate-[22deg] bg-white/50" />

      {/* Date + CTA */}
      <div className="absolute left-[35px] top-[80px] text-right">
        <p>{item.date}</p>
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="group pointer-events-auto mt-1 inline-flex items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-md transition duration-300 hover:border-white/60 hover:bg-white/15 hover:shadow-[0_0_22px_rgba(255,255,255,0.65)]"
        >
          Click to explore
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
        <span className="mt-1 block h-px w-full bg-white/70" />
      </div>
    </div>
  )
}
