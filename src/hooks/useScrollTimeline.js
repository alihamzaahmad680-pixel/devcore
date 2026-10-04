import { gsap, useGSAP } from '../lib/gsap'
import { KEYFRAMES } from '../config/scene'
import { sceneState, setActiveSection } from '../store/sceneState'

const DEFAULT_EASE = 'power2.inOut'

export function useScrollTimeline(triggerRef) {
  useGSAP(
    () => {
      const steps = KEYFRAMES.length - 1
      const tl = gsap.timeline({
        defaults: { duration: 1, ease: DEFAULT_EASE },
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (self) => {
            sceneState.progress = self.progress
            setActiveSection(Math.round(self.progress * steps))
          },
        },
      })

      KEYFRAMES.slice(1).forEach((kf, i) => {
        const ease = { camera: DEFAULT_EASE, fx: DEFAULT_EASE, ...kf.ease }
        // Split Y from X/Z so vertical moves can arc (tilt-up, swoops) independently.
        tl.to(sceneState.camera, { x: kf.camera.x, z: kf.camera.z, ease: ease.camera }, i)
          .to(sceneState.camera, { y: kf.camera.y, ease: ease.cameraY ?? ease.camera }, i)
          .to(sceneState.target, { x: kf.target.x, z: kf.target.z, ease: ease.camera }, i)
          .to(sceneState.target, { y: kf.target.y, ease: ease.targetY ?? ease.camera }, i)
          .to(sceneState.fx, { ...kf.fx, ease: ease.fx }, i)
      })
    },
    { dependencies: [], scope: triggerRef },
  )
}
