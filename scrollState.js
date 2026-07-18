// Module-level mutable state shared between DOM scroll (GSAP) and the R3F
// frame loop. Mutated every scroll tick — deliberately not React state.
export const camState = {
  // progress of each section's entry transition, index-aligned with KEYFRAMES
  prog: [],
}

export const turntable = {
  angle: 0,
  vel: 0,
  dragging: false,
  lastInteraction: 0,
}

if (typeof window !== 'undefined') window.__tt = turntable

// Derive current segment: largest section index whose entry has begun
export function currentSeg() {
  let seg = 0
  let t = 1
  for (let i = 1; i < camState.prog.length; i++) {
    if (camState.prog[i] > 0) {
      seg = i
      t = camState.prog[i]
    }
  }
  return { seg, t }
}
