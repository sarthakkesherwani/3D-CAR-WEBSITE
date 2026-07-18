import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './three/Experience.jsx'
import Loader from './ui/Loader.jsx'
import FeatureCard from './ui/FeatureCard.jsx'
import Specs from './ui/Specs.jsx'
import Configurator from './ui/Configurator.jsx'
import Fallback from './ui/Fallback.jsx'
import { gsap, ScrollTrigger } from './gsapSetup.js'
import { camState } from './scrollState.js'
import { FEATURES, SECTION_COUNT, accentFor } from './config.js'
import { useStore } from './store.js'
import { playEngineStart, playClick } from './sound.js'

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const hasGL = useMemo(webglAvailable, [])
  if (!hasGL) return <Fallback />
  return <Showcase />
}

function Showcase() {
  const main = useRef()
  const loaded = useStore((s) => s.loaded)
  const paint = useStore((s) => s.paint)
  const soundOn = useStore((s) => s.soundOn)
  const setSoundOn = useStore((s) => s.setSoundOn)
  const [started, setStarted] = useState(false)
  const accent = accentFor(paint)

  // Scroll choreography: one trigger per section writes camState.prog[i];
  // the R3F loop consumes it. UI cards get their own tweens.
  useEffect(() => {
    if (!loaded) return
    camState.prog = new Array(SECTION_COUNT).fill(0)
    camState.prog[0] = 1

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('[data-section]')
      sections.forEach((sec, i) => {
        if (i === 0) return
        ScrollTrigger.create({
          trigger: sec,
          start: 'top bottom',
          end: 'top 30%',
          scrub: true,
          onUpdate: (self) => { camState.prog[i] = self.progress },
        })
      })

      // hero text drifts out
      gsap.to('[data-hero]', {
        opacity: 0, y: -60,
        scrollTrigger: { trigger: sections[1], start: 'top bottom', end: 'top 55%', scrub: true },
      })

      // feature cards fade in/out around their section centre
      FEATURES.forEach((f) => {
        const card = document.querySelector(`[data-card="${f.id}"]`)
        const sec = document.querySelector(`#${f.id}`)
        if (!card || !sec) return
        gsap.fromTo(card,
          { opacity: 0, y: 48 },
          {
            opacity: 1, y: 0, ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top 62%', end: 'top 28%', scrub: true },
          })
        gsap.to(card, {
          opacity: 0, y: -40, ease: 'none',
          scrollTrigger: { trigger: sec, start: 'bottom 70%', end: 'bottom 40%', scrub: true },
        })
      })

      gsap.from('[data-config-panel]', {
        opacity: 0, x: 80, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#configure', start: 'top 60%', once: true },
      })
      gsap.from('[data-finale] > *', {
        opacity: 0, y: 40, stagger: 0.15, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '#finale', start: 'top 55%', once: true },
      })
    }, main)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [loaded])

  const begin = () => {
    setStarted(true)
    if (!soundOn) setSoundOn(true)
    // state update is sync in zustand; engine sound reads latest state
    setTimeout(playEngineStart, 30)
    document.querySelector('#design')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main ref={main} className="relative">
      <Loader />

      {/* fixed 3D stage behind everything */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [6.2, 1.9, 7.4], fov: 38 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Experience />
        </Canvas>
      </div>

      {/* top chrome */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
        <p className="pointer-events-auto font-display text-sm font-semibold tracking-[0.45em] text-white">
          AURION
        </p>
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            aria-label={soundOn ? 'Mute sound' : 'Enable sound'}
            onClick={() => { setSoundOn(!soundOn); if (!soundOn) setTimeout(playClick, 20) }}
            className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-md transition-colors hover:text-white"
          >
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
          <a
            href="#configure"
            className="rounded-full bg-white px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition-transform hover:scale-105"
          >
            Configure
          </a>
        </div>
      </header>

      {/* scroll content */}
      <div className="relative z-10">
        {/* 0 — hero */}
        <section data-section id="hero" className="flex h-[110vh] flex-col items-center justify-center px-6">
          <div data-hero className="pointer-events-none text-center">
            <p className="text-[11px] uppercase tracking-[0.6em]" style={{ color: accent }}>
              The new hyper grand tourer
            </p>
            <h1 className="mt-5 font-display text-[clamp(3.5rem,14vw,10rem)] font-bold leading-[0.9] tracking-tighter text-white">
              GT-S
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/55">
              850 horsepower. 2.9 seconds to sixty. Drag the car to explore — then scroll to go deeper.
            </p>
            <button
              type="button"
              onClick={begin}
              className="pointer-events-auto mt-10 rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition-all hover:border-white hover:bg-white hover:text-black"
            >
              {started ? 'Running' : 'Start engine'}
            </button>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="animate-hint h-9 w-5 rounded-full border border-white/25 p-1">
              <div className="mx-auto h-2 w-0.5 rounded bg-white/60" />
            </div>
          </div>
        </section>

        {/* 1–4 — feature sections */}
        {FEATURES.map((f) => (
          <section
            data-section
            key={f.id}
            id={f.id}
            className={`flex min-h-[130vh] items-center px-6 md:px-16 ${f.align === 'right' ? 'justify-end' : ''}`}
          >
            <FeatureCard feature={f} />
          </section>
        ))}

        {/* 5 — specs */}
        <section data-section id="specs" className="flex min-h-[120vh] items-center py-32">
          <Specs />
        </section>

        {/* 6 — configurator */}
        <section data-section id="configure" className="flex min-h-[130vh] items-center px-6 md:justify-end md:px-16">
          <div data-config-panel>
            <Configurator />
          </div>
        </section>

        {/* 7 — finale */}
        <section data-section id="finale" className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-6">
          <div data-finale className="pointer-events-none text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40">AURION GT-S</p>
            <h2 className="mt-4 font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
              Own the horizon
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-sm text-white/50">
              First deliveries spring 2027. Reserve your build slot with a refundable deposit.
            </p>
            <div className="pointer-events-auto mt-9 flex justify-center gap-4">
              <button type="button" onClick={playClick} className="rounded-full bg-white px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-black transition-transform hover:scale-105">
                Reserve now
              </button>
              <a href="#hero" className="rounded-full border border-white/25 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 transition-colors hover:border-white hover:text-white">
                Back to top
              </a>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-8 w-full overflow-hidden opacity-[0.07]">
            <div className="animate-marquee flex w-max whitespace-nowrap font-display text-[11vw] font-bold leading-none text-white">
              <span className="pr-16">AURION GT-S — 850 HP — 205 MPH —&nbsp;</span>
              <span className="pr-16">AURION GT-S — 850 HP — 205 MPH —&nbsp;</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
