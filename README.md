# IGLOO — Interactive 3D Scroll Experience

React 19 · Vite · Tailwind v4 · three.js · @react-three/fiber · drei · postprocessing · GSAP ScrollTrigger · Lenis

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build && npm run preview
```

Requires Node.js 18+.

## Scroll sequence

| # | Section | What happens |
|---|---------|--------------|
| 01 | Igloo | Block igloo on snowy mountains; light leaks through the seams; blocks pop out under the cursor and at random |
| 02 | Portfolio 01 | Blocks blast skyward, the camera tilts up into the clouds, and an ice crystal rises with a frozen object inside and HUD callouts |
| 03 | Portfolio 02 | Fly forward; the first crystal drops away and the next one arrives |
| 04 | Portal | Debris assembles into counter-rotating gyroscope arcs around a blinding core |
| 05 | Showcase | Fly through the portal; a particle-cloud character streams together on a concentric platform |

## Structure

```
src/
├─ App.jsx                     # composition root (lazy-loads the WebGL bundle)
├─ index.css                   # Tailwind v4 theme, keyframes, Lenis overrides
├─ config/
│  ├─ scene.js                 # world layout + per-section camera/fx KEYFRAMES
│  ├─ content.js               # sections, portfolio callouts, links, manifesto
│  └─ models.js                # optional .glb overrides
├─ store/sceneState.js         # mutable scroll/pointer state shared by GSAP + R3F
├─ hooks/                      # scroll timeline, pointer, ambient sound, text scramble
├─ lib/gsap.js                 # plugin registration
├─ utils/                      # math/noise/rng, procedural textures
└─ components/
   ├─ SmoothScroll.jsx         # Lenis on GSAP's ticker (single rAF loop)
   ├─ Preloader.jsx
   ├─ canvas/                  # Scene3D + every 3D element and the post-FX stack
   ├─ hud/                     # HUDOverlay, SoundToggle, Radar, FogText
   └─ sections/                # scroll sections + final link carousel
```

## Customising

- **Camera path / timing**: edit `KEYFRAMES` in `src/config/scene.js`. Each keyframe matches one section.
- **Copy and portfolio callouts**: edit `src/config/content.js`.
- **Your own models**: put `.glb` files in `public/models/` and set the paths in `src/config/models.js`. An igloo model's child meshes get blasted apart. A character model's surface gets sampled into the particle cloud.

## Performance notes

- GSAP writes to a plain mutable object; `useFrame` reads and damps it. Scrolling causes no React re-renders, except a single one when the active section changes.
- The igloo blocks, clouds and portal segments are each one instanced draw call. Snow and the character are GPU shaders.
- Off-screen groups (terrain, igloo, crystals, portal, stage) toggle `visible` based on where the camera is.
- `PerformanceMonitor` drops DPR to 1 and disables depth-of-field and MSAA on slow devices.
- Audio is synthesised with Web Audio, so there are no audio downloads.
