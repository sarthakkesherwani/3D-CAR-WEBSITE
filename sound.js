// Synthesized audio via WebAudio — no asset files needed.
import { useStore } from './store.js'

let ctx = null
const ac = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

const enabled = () => useStore.getState().soundOn

export function playClick() {
  if (!enabled()) return
  try {
    const c = ac()
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(880, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.08)
    g.gain.setValueAtTime(0.06, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.12)
    o.connect(g).connect(c.destination)
    o.start()
    o.stop(c.currentTime + 0.14)
  } catch { /* audio unavailable */ }
}

// Engine start: rumble (filtered saw stack) + starter whine + rev swell
export function playEngineStart() {
  if (!enabled()) return
  try {
    const c = ac()
    const t = c.currentTime
    const master = c.createGain()
    master.gain.setValueAtTime(0.0001, t)
    master.gain.exponentialRampToValueAtTime(0.32, t + 0.25)
    master.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(220, t)
    lp.frequency.exponentialRampToValueAtTime(900, t + 1.2)
    lp.frequency.exponentialRampToValueAtTime(320, t + 3.0)
    lp.connect(master).connect(c.destination)

    ;[55, 82.5, 110, 165].forEach((f, i) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.type = i % 2 ? 'sawtooth' : 'square'
      o.frequency.setValueAtTime(f * 0.6, t)
      o.frequency.exponentialRampToValueAtTime(f * 2.4, t + 1.1)
      o.frequency.exponentialRampToValueAtTime(f, t + 2.8)
      g.gain.value = 0.22 / (i + 1)
      o.connect(g).connect(lp)
      o.start(t)
      o.stop(t + 3.2)
    })

    // starter whine
    const w = c.createOscillator()
    const wg = c.createGain()
    w.type = 'triangle'
    w.frequency.setValueAtTime(320, t)
    w.frequency.exponentialRampToValueAtTime(1400, t + 0.5)
    wg.gain.setValueAtTime(0.05, t)
    wg.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
    w.connect(wg).connect(c.destination)
    w.start(t)
    w.stop(t + 0.6)
  } catch { /* audio unavailable */ }
}
