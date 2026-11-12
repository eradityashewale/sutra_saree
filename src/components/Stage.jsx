import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import site from '../../site.config.js'
import { collections, heroLook } from '../data/collections.js'
import { stage } from '../lib/stage.js'
import { hasWebGL, scrollToId } from '../lib/device.js'
import { chatMessage } from '../lib/whatsapp.js'
import { Icon, Magnetic, paths, WaLink, WhatsAppIcon } from './ui.jsx'

// three.js + the scene are a separate chunk, fetched after first paint.
const SilkScene = lazy(() => import('../three/SilkScene.jsx'))

/* Kinetic headline: split into letters that rise in one by one (CSS-driven,
   so it runs before any 3D code has loaded). */
function Kinetic({ lines }) {
  let i = 0
  return (
    <h1
      aria-label={lines.join(' ')}
      className="font-display text-[clamp(3.4rem,15vw,11rem)] font-medium leading-[0.86] tracking-[-0.03em]"
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className={`k-line ${li === 1 ? 'italic text-gold' : ''}`}>
          {line.split(' ').map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {[...word].map((ch) => (
                <span key={i} className="k-letter" style={{ '--i': i++ }}>
                  {ch}
                </span>
              ))}
              {' '}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function Hero() {
  const ref = useRef()
  useEffect(() => {
    // Headline drifts up and fades as you scroll into the collections.
    const ctx = gsap.context(() => {
      gsap.to('.hero-inner', {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom 35%', scrub: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <header ref={ref} className="relative flex min-h-[100svh] items-end px-5 pb-24 pt-28 sm:px-10 sm:pb-20">
      <div className="hero-inner mx-auto w-full max-w-7xl">
        <p className="fade-up font-kinetic text-[11px] font-semibold uppercase tracking-[0.24em] text-gold sm:text-xs" style={{ '--d': '0.5s' }}>
          {site.eyebrow}
        </p>
        <div className="mt-4">
          <Kinetic lines={site.headline} />
        </div>
        <p lang="mr" className="fade-up font-deva mt-5 text-2xl text-ivory sm:text-3xl" style={{ '--d': '1.5s' }}>
          {site.taglineDevanagari}
        </p>
        <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ '--d': '1.7s' }}>
          <Magnetic>
            <button
              onClick={() => scrollToId('shop')}
              className="inline-flex h-13 items-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-bold text-charcoal transition hover:bg-ivory"
            >
              Shop Sarees <Icon d={paths.arrow} className="h-4 w-4" />
            </button>
          </Magnetic>
          <Magnetic>
            <WaLink
              text={chatMessage()}
              placement="hero"
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-ivory transition hover:bg-white/20"
            >
              <WhatsAppIcon /> Chat on WhatsApp
            </WaLink>
          </Magnetic>
        </div>
      </div>
      <div aria-hidden="true" className="fade-up absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-ivory/70" style={{ '--d': '2.2s' }}>
        Scroll
      </div>
    </header>
  )
}

/* Scroll storytelling: a tall section with a sticky panel. Each screen of
   scroll activates the next collection; the cloth recolours and moves to match. */
function CollectionStory({ active, setActive, onShop }) {
  const ref = useRef()
  const n = collections.length
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 55%',
      end: 'bottom 60%',
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
      onLeaveBack: () => setActive(-1),
    })
    return () => st.kill()
  }, [n, setActive])

  return (
    <section ref={ref} id="collections" aria-label="Collections" style={{ height: `${n * 90}svh` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-5 sm:px-10">
        <div className="relative mx-auto h-[62svh] w-full max-w-7xl">
          {collections.map((c, i) => {
            const on = i === active || (active < 0 && i === 0)
            return (
              <article
                key={c.id}
                aria-hidden={!on}
                className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
                  on ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'
                }`}
              >
                <p className="font-kinetic text-xs font-semibold tracking-[0.24em] text-gold">
                  0{i + 1} <span className="text-ivory/60">/ 0{n}</span>
                </p>
                <h2 className="font-kinetic mt-3 text-[clamp(3rem,13.5vw,10.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em]">
                  {c.id}
                </h2>
                <p lang="mr" className="font-deva mt-2 text-2xl text-gold sm:text-4xl">
                  {c.devanagari}
                </p>
                <p className="mt-4 max-w-sm text-base text-ivory/90 sm:text-lg">{c.blurb}</p>
                <div className="mt-7">
                  <button
                    tabIndex={on ? 0 : -1}
                    onClick={() => onShop(c.id)}
                    className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-ivory transition hover:bg-white/20"
                  >
                    Shop {c.id} <Icon d={paths.arrow} className="h-4 w-4" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        <ol aria-hidden="true" className="absolute bottom-8 left-5 flex gap-2 sm:left-10">
          {collections.map((c, i) => (
            <li key={c.id} className={`h-1 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-gold' : 'w-4 bg-ivory/30'}`} />
          ))}
        </ol>
      </div>
    </section>
  )
}

/* CSS-only silk: shown instantly as the first paint, and kept as the whole
   experience on low-end devices (2.5D parallax) and for reduced motion (still). */
function SilkBackdrop({ look, tier, dimmed }) {
  const ref = useRef()
  useEffect(() => {
    if (tier === 'static') return
    const el = ref.current
    const move = (e) => {
      el.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3))
      el.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3))
    }
    const scroll = () => el.style.setProperty('--my', (window.scrollY / window.innerHeight / 4).toFixed(3))
    window.addEventListener('pointermove', move, { passive: true })
    if (tier === 'lite') window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', scroll)
    }
  }, [tier])
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="silk-backdrop absolute inset-0 overflow-hidden"
      style={{ '--silk-a': look.colors.a, '--silk-b': look.colors.b }}
    >
      <div className={`absolute inset-0 transition-opacity duration-1000 ${dimmed ? 'opacity-0' : 'opacity-100'}`}>
        <div className="silk-fold" />
        <div className="silk-fold" />
        <div className="silk-zari" />
      </div>
    </div>
  )
}

export default function Stage({ tier, onShop }) {
  const [active, setActiveState] = useState(-1)
  const [ready, setReady] = useState(false)
  const webgl = hasWebGL(tier)
  const setActive = useRef((i) => setActiveState(i)).current

  useEffect(() => {
    stage.index = active
  }, [active])

  // Pointer + device tilt feed the cloth.
  useEffect(() => {
    if (!webgl) return
    const move = (e) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      stage.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    const tilt = (e) => {
      if (e.gamma == null) return
      stage.pointer.x = Math.max(-1, Math.min(1, e.gamma / 30))
      stage.pointer.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30)) * -1
    }
    window.addEventListener('pointermove', move, { passive: true })
    // Used where the browser allows it without a permission prompt (no popups).
    window.addEventListener('deviceorientation', tilt, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('deviceorientation', tilt)
    }
  }, [webgl])

  const look = active < 0 ? heroLook : collections[active]

  return (
    <section className={`relative bg-charcoal text-ivory tier-${tier}`}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <SilkBackdrop look={look} tier={tier} dimmed={webgl && ready} />
        {webgl && (
          <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <SilkScene tier={tier} onReady={() => setReady(true)} />
            </Suspense>
          </div>
        )}
        {!webgl && (
          <p className="sr-only">
            Decorative silk background that changes colour for each collection: Banarasi, Kanjivaram, Silk, Cotton and Georgette.
          </p>
        )}
        {/* Scrim keeps the headline readable over the cloth (WCAG AA). */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,22,22,.82)_0%,rgba(22,22,22,.45)_45%,rgba(22,22,22,0)_78%),linear-gradient(0deg,rgba(22,22,22,.7)_0%,rgba(22,22,22,0)_40%)]" />
      </div>
      <div className="relative -mt-[100svh]">
        <Hero />
        <CollectionStory active={active} setActive={setActive} onShop={onShop} />
      </div>
    </section>
  )
}
