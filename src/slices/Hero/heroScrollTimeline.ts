// Shared position map for Hero's two independent scroll-scrubbed
// timelines (Scene.tsx's 3D bottle timeline and index.tsx's DOM/text
// timeline). Both share the exact same ScrollTrigger config
// (trigger:".hero", start:"top top", end:"bottom bottom", scrub:1.5)
// but are otherwise unrelated GSAP timeline instances - importing this
// same object into both, and anchoring each timeline's total duration
// to HERO_TL.end via a trailing zero-duration tween, is what keeps a
// given position value landing at the same scroll-fraction in both.
export const HERO_TL = {
  start: 0,
  blurStart: 0,
  blurDone: 1.0,
  exitStart: 1.0,
  exitDone: 2.0,
  uprightStart: 1.0,
  uprightPeak: 2.2,
  descendStart: 2.2,
  descendDone: 3.4,
  sparkleStart: 1.0,
  sparkleEnd: 2.45,
  rippleFire: 3.45,
  end: 4.0,
} as const;
