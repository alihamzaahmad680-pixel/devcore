// export const COLORS = {
//   fog: '#030712',     // Rich Deep Dark Sky / Backdrop
//   snow: '#e2e8f0',    // Crisp Ice Glow
//   rock: '#0f172a',    // High Contrast Ground Shadows
//   block: '#00f0ff',   // Neon Cyan Highlights
//   glow: '#38bdf8',    // Electric Blue Glow
//   cyan: '#00f0ff',    // Vivid Primary Accent
//   ice: '#0284c7',     // Deep Ice Blue
// }

// export const SKY_Y = 34

// export const IGLOO = {
//   radius: 4,
//   depth: 0.5,
//   tunnel: { radius: 1.5, length: 2.5 }
// }

// export const CRYSTALS = [
//   { position: [0, SKY_Y, -6] },
//   { position: [0.6, SKY_Y, -24] },
// ]

// export const PORTAL = { 
//   position: [0, SKY_Y, -44], 
//   radius: 3.6, 
//   segments: 14 
// }

// export const STAGE = { position: [0, SKY_Y - 1, -62] }

// const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

// export const KEYFRAMES = [
//   {
//     camera: { x: 0, y: isMobile ? 2.2 : 1.8, z: isMobile ? 14 : 10 },
//     target: { x: 0, y: 1.2, z: 0 },
//     fx: { fov: isMobile ? 52 : 40, roll: 0, explode: 0, ring: 0, showcase: 0, fog: 0.004, hero: 1 },
//   },
//   {
//     camera: { x: 0, y: SKY_Y, z: 1.5 },
//     target: { x: 0, y: SKY_Y, z: -6 },
//     fx: { fov: 40, roll: 0.04, explode: 1, ring: 0, showcase: 0, fog: 0.008, hero: 0 },
//     ease: { cameraY: 'power2.in', targetY: 'power3.out', fx: 'power1.out' },
//   },
//   {
//     camera: { x: 0.6, y: SKY_Y, z: -16.5 },
//     target: { x: 0.6, y: SKY_Y, z: -24 },
//     fx: { fov: 40, roll: -0.03, explode: 1, ring: 0, showcase: 0, fog: 0.008, hero: 0 },
//   },
//   {
//     camera: { x: 1.2, y: SKY_Y + 1.2, z: -34 },
//     target: { x: 0, y: SKY_Y, z: -44 },
//     fx: { fov: 42, roll: -0.05, explode: 1, ring: 1, showcase: 0, fog: 0.006, hero: 0 },
//   },
//   {
//     camera: { x: 0, y: SKY_Y + 0.6, z: -55.5 },
//     target: { x: 0, y: SKY_Y + 0.1, z: -62 },
//     fx: { fov: 36, roll: 0, explode: 1, ring: 1, showcase: 1, fog: 0.005, hero: 0 },
//     ease: { cameraY: 'sine.inOut' },
//   },
// ]

// export const INTRO_CAMERA = [0, 4, 16]
export const COLORS = {
  fog: '#030712',     // Rich Deep Dark Sky / Backdrop
  snow: '#e2e8f0',    // Crisp Ice Glow
  rock: '#0f172a',    // High Contrast Ground Shadows
  block: '#00f0ff',   // Neon Cyan Highlights
  glow: '#38bdf8',    // Electric Blue Glow
  cyan: '#00f0ff',    // Vivid Primary Accent
  ice: '#0284c7',     // Deep Ice Blue
}

export const SKY_Y = 34

export const IGLOO = {
  radius: 4,
  depth: 0.5,
  tunnel: { radius: 1.5, length: 2.5 }
}

export const CRYSTALS = [
  { position: [0, SKY_Y, -6] },
  { position: [0.6, SKY_Y, -24] },
]

export const PORTAL = { 
  position: [0, SKY_Y, -44], 
  radius: 3.6, 
  segments: 14 
}

export const STAGE = { position: [0, SKY_Y - 1, -62] }

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

// Dynamic Responsive Keyframes Configuration
export const KEYFRAMES = [
  {
    camera: { 
      x: 0, 
      y: isMobile ? 2.6 : 1.8, 
      z: isMobile ? 18 : 10 // Pushed back further on mobile to fit 3D model entirely
    },
    target: { x: 0, y: 1.2, z: 0 },
    fx: { 
      fov: isMobile ? 60 : 40, // Wider Field of View for small screens
      roll: 0, 
      explode: 0, 
      ring: 0, 
      showcase: 0, 
      fog: 0.003, 
      hero: 1 
    },
  },
  {
    camera: { 
      x: 0, 
      y: SKY_Y, 
      z: isMobile ? 3.5 : 1.5 
    },
    target: { x: 0, y: SKY_Y, z: -6 },
    fx: { 
      fov: isMobile ? 55 : 40, 
      roll: 0.04, 
      explode: 1, 
      ring: 0, 
      showcase: 0, 
      fog: 0.006, 
      hero: 0 
    },
    ease: { cameraY: 'power2.in', targetY: 'power3.out', fx: 'power1.out' },
  },
  {
    camera: { 
      x: 0.6, 
      y: SKY_Y, 
      z: isMobile ? -14.5 : -16.5 
    },
    target: { x: 0.6, y: SKY_Y, z: -24 },
    fx: { 
      fov: isMobile ? 55 : 40, 
      roll: -0.03, 
      explode: 1, 
      ring: 0, 
      showcase: 0, 
      fog: 0.006, 
      hero: 0 
    },
  },
  {
    camera: { 
      x: isMobile ? 0.6 : 1.2, 
      y: SKY_Y + 1.2, 
      z: isMobile ? -31 : -34 
    },
    target: { x: 0, y: SKY_Y, z: -44 },
    fx: { 
      fov: isMobile ? 58 : 42, 
      roll: -0.05, 
      explode: 1, 
      ring: 1, 
      showcase: 0, 
      fog: 0.005, 
      hero: 0 
    },
  },
  {
    camera: { 
      x: 0, 
      y: SKY_Y + 0.6, 
      z: isMobile ? -52 : -55.5 
    },
    target: { x: 0, y: SKY_Y + 0.1, z: -62 },
    fx: { 
      fov: isMobile ? 50 : 36, 
      roll: 0, 
      explode: 1, 
      ring: 1, 
      showcase: 1, 
      fog: 0.004, 
      hero: 0 
    },
    ease: { cameraY: 'sine.inOut' },
  },
]

export const INTRO_CAMERA = isMobile ? [0, 5, 22] : [0, 4, 16]