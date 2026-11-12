import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { track } from '../lib/analytics.js'
import { waLink } from '../lib/whatsapp.js'
import { finePointer } from '../lib/device.js'

/* ── Icons (inline SVG, no icon font to download) ─────────────── */
export const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24ZM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.76 2.67 4.25 3.74.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.29-.25-.12-1.47-.72-1.69-.81-.23-.08-.37-.12-.56.13-.16.25-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23a7.4 7.4 0 0 1-1.38-1.72c-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43h-.48Z" />
  </svg>
)
export const InstagramIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
  </svg>
)
export const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)
export const paths = {
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  close: 'M6 6l12 12M18 6L6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  bag: 'M6 8h12l-1 12H7L6 8zM9 8V6a3 3 0 0 1 6 0v2',
  menu: 'M4 7h16M4 12h16M4 17h16',
  truck: 'M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  cash: 'M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 10v4M18 10v4',
  swap: 'M4 8h13l-3-3M20 16H7l3 3',
  leaf: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14zM5 19l7-7',
  rotate: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
}

/* ── WhatsApp link: every tap is counted ──────────────────────── */
export function WaLink({ text, placement, product, className = '', children, ...rest }) {
  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => track('whatsapp_click', { placement, ...(product ? { product } : {}) })}
      {...rest}
    >
      {children}
    </a>
  )
}

/* ── Magnetic wrapper: the button leans toward the cursor (desktop only) ── */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    if (!finePointer() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * strength)
      y((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      x(0)
      y(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  )
}

/* ── Scroll reveal: fades content up when it enters the viewport ── */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}s` }} {...rest}>
      {children}
    </Tag>
  )
}

/* ── Section heading with oversized type + variable-weight animation ── */
export function SectionHead({ eyebrow, title, children, dark = false, id }) {
  return (
    <Reveal className="mb-8 sm:mb-12">
      {eyebrow && (
        <p className={`font-kinetic text-xs font-semibold uppercase tracking-[0.22em] ${dark ? 'text-gold' : 'text-maroon'}`}>
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="vf font-display mt-3 text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] tracking-tight">
        {title}
      </h2>
      {children && <p className={`mt-4 max-w-xl text-base ${dark ? 'text-ivory/80' : 'text-charcoal/75'}`}>{children}</p>}
    </Reveal>
  )
}

/* ── Cursor-follow glow (desktop only) ────────────────────────── */
export function CursorGlow() {
  const ref = useRef()
  useEffect(() => {
    if (!finePointer() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    el.style.opacity = '1'
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => {
      x(e.clientX)
      y(e.clientY)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] -ml-40 -mt-40 h-80 w-80 rounded-full opacity-0 mix-blend-soft-light"
      style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.55), transparent 65%)' }}
    />
  )
}
