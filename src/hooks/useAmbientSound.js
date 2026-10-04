import { useCallback, useEffect, useRef, useState } from 'react'

const MASTER_LEVEL = 0.5

/** Procedural arctic wind + low pad via Web Audio — zero audio assets to download. */
function createAudioGraph() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return null
  const ctx = new AudioCtx()

  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Wind: looping brown noise through a slowly swept band-pass filter.
  const length = ctx.sampleRate * 4
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.5
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  noise.loop = true

  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 500
  band.Q.value = 0.8

  const sweep = ctx.createOscillator()
  sweep.frequency.value = 0.06
  const sweepDepth = ctx.createGain()
  sweepDepth.gain.value = 320
  sweep.connect(sweepDepth).connect(band.frequency)

  const windGain = ctx.createGain()
  windGain.gain.value = 0.55
  noise.connect(band).connect(windGain).connect(master)

  // Pad: two detuned sines, very quiet.
  ;[110, 164.81].forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.frequency.value = freq
    osc.detune.value = i ? 7 : -7
    const g = ctx.createGain()
    g.gain.value = 0.035
    osc.connect(g).connect(master)
    osc.start()
  })

  noise.start()
  sweep.start()
  return { ctx, master }
}

export function useAmbientSound() {
  const graph = useRef(null)
  const enabledRef = useRef(false)
  const [enabled, setEnabled] = useState(false)

  const toggle = useCallback(() => {
    graph.current ??= createAudioGraph()
    const g = graph.current
    if (!g) return

    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)

    const now = g.ctx.currentTime
    g.master.gain.cancelScheduledValues(now)
    if (next) {
      g.ctx.resume()
      g.master.gain.setTargetAtTime(MASTER_LEVEL, now, 0.6)
    } else {
      g.master.gain.setTargetAtTime(0, now, 0.2)
      // Suspend after the fade so the audio thread idles.
      setTimeout(() => !enabledRef.current && g.ctx.suspend(), 1200)
    }
  }, [])

  /** Short glassy chime — used for section changes. */
  const ping = useCallback(() => {
    const g = graph.current
    if (!g || !enabledRef.current) return
    const { ctx } = g
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.frequency.setValueAtTime(1480, t)
    osc.frequency.exponentialRampToValueAtTime(740, t + 0.4)
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(0.08, t + 0.01)
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.7)
    osc.connect(env).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.75)
  }, [])

  useEffect(
    () => () => {
      graph.current?.ctx.close()
      graph.current = null
    },
    [],
  )

  return { enabled, toggle, ping }
}
