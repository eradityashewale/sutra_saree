import { useRef } from 'react'
import { useEnquiry } from '../lib/enquiry.jsx'
import { inr, productMessage } from '../lib/whatsapp.js'
import { Icon, paths, WaLink, WhatsAppIcon } from './ui.jsx'

// 3D tilt: follows the mouse on desktop, gives a short tilt "kick" on tap on phones.
function useTilt() {
  const ref = useRef()
  const timer = useRef()
  const apply = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.classList.add('is-active')
    el.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 11).toFixed(2)}deg`)
    el.style.setProperty('--px', `${(-x * 16).toFixed(1)}px`)
    el.style.setProperty('--py', `${(-y * 16).toFixed(1)}px`)
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(0)}%`)
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(0)}%`)
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    el.classList.remove('is-active')
    ;['--rx', '--ry', '--px', '--py'].forEach((p) => el.style.removeProperty(p))
  }
  return {
    ref,
    onPointerMove: (e) => e.pointerType === 'mouse' && apply(e),
    onPointerLeave: reset,
    onPointerDown: (e) => {
      if (e.pointerType === 'mouse') return
      apply(e)
      clearTimeout(timer.current)
      timer.current = setTimeout(reset, 450)
    },
  }
}

export default function ProductCard({ product: p, onView, big = false, className = '', eager = false }) {
  const tilt = useTilt()
  const { has, toggle } = useEnquiry()
  const added = has(p.id)

  return (
    <article {...tilt} className={`tilt group relative isolate overflow-hidden rounded-[24px] bg-maroon shadow-soft ${className}`}>
      <img
        src={p.image}
        alt={`${p.name} — ${p.fabric} saree`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        width="800"
        height="1000"
        className="tilt-img absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="tilt-shine pointer-events-none absolute inset-0" />

      {/* The whole photo opens the 360° drape view */}
      <button onClick={() => onView(p)} aria-label={`View ${p.name} in 360°`} className="absolute inset-0 z-10" />

      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-start justify-between gap-2">
        <span>
          {p.stock <= 5 && (
            <span className="inline-block rounded-full bg-maroon px-3 py-1 text-[11px] font-bold text-ivory ring-1 ring-ivory/30">
              Only {p.stock} left
            </span>
          )}
        </span>
        <span className="glass-dark inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-ivory">
          <Icon d={paths.rotate} className="h-3.5 w-3.5" /> 360°
        </span>
      </div>

      <div className={`glass-dark absolute inset-x-2 bottom-2 z-20 rounded-[18px] text-ivory sm:inset-x-3 sm:bottom-3 ${big ? 'p-4 sm:p-5' : 'p-3'}`}>
        <h3 className={`font-display font-semibold leading-tight ${big ? 'text-xl sm:text-3xl' : 'line-clamp-2 text-[15px] sm:text-lg'}`}>{p.name}</h3>
        <p className="mt-1 flex items-baseline justify-between gap-2 text-xs sm:text-sm">
          <span className="text-ivory/85">{p.fabric}</span>
          <span className="text-sm font-bold text-gold sm:text-base">{inr(p.price)}</span>
        </p>
        <div className="mt-2.5 flex gap-2">
          <WaLink
            text={productMessage(p)}
            placement="product_card"
            product={p.id}
            aria-label={`Order ${p.name} on WhatsApp`}
            className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-gold px-3 text-[13px] font-bold text-charcoal transition hover:bg-ivory"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{big ? 'Order on WhatsApp' : 'Order'}</span>
          </WaLink>
          <button
            onClick={() => toggle(p.id)}
            aria-pressed={added}
            aria-label={added ? `Remove ${p.name} from enquiry list` : `Add ${p.name} to enquiry list`}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition ${
              added ? 'border-gold bg-gold text-charcoal' : 'border-ivory/50 text-ivory hover:bg-white/15'
            }`}
          >
            <Icon d={added ? paths.check : paths.plus} />
          </button>
        </div>
      </div>
    </article>
  )
}
