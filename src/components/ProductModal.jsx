import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useEnquiry } from '../lib/enquiry.jsx'
import { hasWebGL } from '../lib/device.js'
import { inr, productMessage } from '../lib/whatsapp.js'
import { Icon, paths, WaLink, WhatsAppIcon } from './ui.jsx'

const DrapeViewer3D = lazy(() => import('../three/DrapeViewer3D.jsx'))

/* Image-sequence fallback: set "sequence": ["/images/360/a-01.webp", ...] on a
   product (24–36 photos taken around the saree) and drag to spin it. */
function ImageSequence({ frames, alt }) {
  const [i, setI] = useState(0)
  const drag = useRef(null)
  useEffect(() => {
    frames.forEach((src) => (new Image().src = src))
  }, [frames])
  const step = (d) => setI((v) => (v + d + frames.length) % frames.length)
  return (
    <div
      role="img"
      aria-label={`${alt}. Drag or use the arrow keys to rotate.`}
      tabIndex={0}
      className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
      onKeyDown={(e) => (e.key === 'ArrowLeft' ? step(-1) : e.key === 'ArrowRight' ? step(1) : null)}
      onPointerDown={(e) => {
        drag.current = e.clientX
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerMove={(e) => {
        if (drag.current == null) return
        const dx = e.clientX - drag.current
        if (Math.abs(dx) > 8) {
          step(dx > 0 ? 1 : -1)
          drag.current = e.clientX
        }
      }}
    >
      <img src={frames[i]} alt="" draggable="false" className="h-full w-full object-contain" />
    </div>
  )
}

export default function ProductModal({ product: p, tier, onClose }) {
  const { has, toggle } = useEnquiry()
  const dialog = useRef()
  const closeBtn = useRef()
  const added = has(p.id)
  const use3D = !p.sequence && hasWebGL(tier)

  useEffect(() => {
    const prev = document.activeElement
    closeBtn.current?.focus()
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        // keep focus inside the dialog
        const f = dialog.current.querySelectorAll('a[href],button,[tabindex="0"]')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus())
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus())
      }
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      document.body.style.overflow = ''
      window.__lenis?.start()
      prev?.focus?.()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" data-lenis-prevent>
      <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-title"
        className="relative grid max-h-[94svh] w-full max-w-5xl overflow-y-auto rounded-t-[28px] bg-ivory sm:rounded-[28px] md:grid-cols-[1.15fr_1fr] md:overflow-hidden"
      >
        <button
          ref={closeBtn}
          onClick={onClose}
          aria-label="Close"
          className="glass-dark absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full text-ivory"
        >
          <Icon d={paths.close} />
        </button>

        <div className="relative h-[48svh] bg-[radial-gradient(circle_at_50%_35%,#3a2a22,#161616_75%)] md:h-[640px]">
          {p.sequence ? (
            <ImageSequence frames={p.sequence} alt={`${p.name} from all sides`} />
          ) : use3D ? (
            <div
              className="h-full w-full touch-none"
              role="img"
              aria-label={`360 degree drape view of ${p.name}, a ${p.fabric} saree. Drag to rotate, pinch or scroll to zoom.`}
            >
              <Suspense fallback={<img src={p.image} alt="" className="h-full w-full object-cover opacity-60" />}>
                <DrapeViewer3D product={p} />
              </Suspense>
            </div>
          ) : (
            <img src={p.image} alt={`${p.name} — ${p.fabric} saree`} className="h-full w-full object-cover" />
          )}
          {(use3D || p.sequence) && (
            <p className="glass-dark pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-ivory">
              <Icon d={paths.rotate} className="h-4 w-4" /> Drag to rotate · pinch to zoom
            </p>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <p className="font-kinetic text-xs font-semibold uppercase tracking-[0.22em] text-maroon">{p.fabric}</p>
          <h2 id="pm-title" className="font-display mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            {p.name}
          </h2>
          <p className="mt-3 text-2xl font-bold text-maroon">{inr(p.price)}</p>
          {p.stock <= 5 && <p className="mt-1 text-sm font-semibold text-maroon">Only {p.stock} left</p>}
          <p className="mt-4 text-charcoal/80">{p.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.occasion.map((o) => (
              <li key={o} className="rounded-full bg-maroon/8 px-3 py-1 text-xs font-semibold capitalize text-maroon">
                {o}
              </li>
            ))}
          </ul>
          {!p.model && !p.sequence && use3D && (
            <p className="mt-4 text-xs text-charcoal/65">The 3D view shows this saree's colours and drape. See the photo for the exact weave.</p>
          )}
          <div className="mt-auto space-y-3 pt-6">
            <WaLink
              text={productMessage(p)}
              placement="product_modal"
              product={p.id}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-wa text-base font-bold text-white transition hover:brightness-110"
            >
              <WhatsAppIcon /> Order on WhatsApp
            </WaLink>
            <button
              onClick={() => toggle(p.id)}
              aria-pressed={added}
              className={`flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 text-base font-bold transition ${
                added ? 'border-maroon bg-maroon text-ivory' : 'border-maroon text-maroon hover:bg-maroon/5'
              }`}
            >
              <Icon d={added ? paths.check : paths.plus} /> {added ? 'Added to enquiry' : 'Add to enquiry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
