export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const smoothstep = (v) => v * v * (3 - 2 * v)
export const remap01 = (v, start, end) => clamp01((v - start) / (end - start))

export const damp = (lambda, delta) => 1 - Math.exp(-lambda * Math.min(delta, 0.1))

export function createRng(seed = 1) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}


const hash = (x, z) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function valueNoise(x, z) {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = x - xi
  const zf = z - zi
  const u = smoothstep(xf)
  const v = smoothstep(zf)
  const a = hash(xi, zi)
  const b = hash(xi + 1, zi)
  const c = hash(xi, zi + 1)
  const d = hash(xi + 1, zi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

export function fbm(x, z, octaves = 5) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, z * freq)
    freq *= 2.03
    amp *= 0.5
  }
  return sum
}

export function ridged(x, z, octaves = 5) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(valueNoise(x * freq, z * freq) * 2 - 1)
    sum += amp * n * n
    freq *= 2.1
    amp *= 0.5
  }
  return sum
}
