import { useEffect, useRef, useState } from 'react'
import site from '../../site.config.js'
import { useEnquiry } from '../lib/enquiry.jsx'
import { cartMessage, chatMessage, inr } from '../lib/whatsapp.js'
import { Icon, paths, WaLink, WhatsAppIcon } from './ui.jsx'

/* ── Page-load reveal ─────────────────────────────────────────── */
export function Loader() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const a = setTimeout(() => setDone(true), 450)
    const b = setTimeout(() => setGone(true), 1500)
    return () => (clearTimeout(a), clearTimeout(b))
  }, [])
  if (gone) return null
  return (
    <div aria-hidden="true" className={`loader fixed inset-0 z-[100] grid place-items-center bg-maroon ${done ? 'done' : ''}`}>
      <p className="font-display text-3xl italic text-gold">{site.brand}</p>
    </div>
  )
}

/* ── Floating WhatsApp button + enquiry pill ──────────────────── */
export function FloatingWhatsApp() {
  const { ids, setOpen } = useEnquiry()
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {ids.length > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="flex h-12 items-center gap-2 rounded-full bg-gold px-5 text-sm font-bold text-charcoal shadow-lg"
        >
          <Icon d={paths.bag} className="h-4 w-4" /> Enquiry list ({ids.length})
        </button>
      )}
      <WaLink
        text={chatMessage()}
        placement="floating"
        aria-label="Chat with us on WhatsApp"
        className="wa-pulse relative flex h-14 items-center gap-2 rounded-full bg-wa pl-4 pr-5 text-sm font-bold text-white shadow-lg"
      >
        <WhatsAppIcon className="h-6 w-6" /> Chat with us
      </WaLink>
    </div>
  )
}

/* ── "Cart on WhatsApp" drawer ────────────────────────────────── */
export function EnquiryDrawer() {
  const { items, toggle, clear, open, setOpen } = useEnquiry()
  const closeBtn = useRef()

  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()
    window.__lenis?.stop()
    const key = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      window.__lenis?.start()
    }
  }, [open, setOpen])

  if (!open) return null
  const total = items.reduce((s, p) => s + p.price, 0)

  return (
    <div className="fixed inset-0 z-[90]" data-lenis-prevent>
      <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="enq-drawer-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[28px] bg-ivory sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-l-[28px] sm:rounded-tr-none"
      >
        <header className="flex items-center justify-between border-b border-maroon/15 px-6 py-5">
          <h2 id="enq-drawer-title" className="font-display text-2xl font-semibold">
            Your enquiry list
          </h2>
          <button ref={closeBtn} onClick={() => setOpen(false)} aria-label="Close enquiry list" className="grid h-11 w-11 place-items-center rounded-full border border-maroon/25">
            <Icon d={paths.close} />
          </button>
        </header>

        {items.length === 0 ? (
          <p className="p-8 text-center text-charcoal/75">Your list is empty. Tap the + on any saree to add it here.</p>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-maroon/10 overflow-y-auto px-6">
              {items.map((p) => (
                <li key={p.id} className="flex items-center gap-4 py-4">
                  <img src={p.image} alt="" className="h-20 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-lg font-semibold">{p.name}</p>
                    <p className="text-sm text-charcoal/75">
                      {p.fabric} · <span className="font-bold text-maroon">{inr(p.price)}</span>
                    </p>
                  </div>
                  <button onClick={() => toggle(p.id)} aria-label={`Remove ${p.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-charcoal/70 hover:bg-maroon/10">
                    <Icon d={paths.close} className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <footer className="space-y-3 border-t border-maroon/15 p-6">
              <p className="flex justify-between text-base font-bold">
                <span>
                  {items.length} {items.length === 1 ? 'saree' : 'sarees'}
                </span>
                <span>{inr(total)}</span>
              </p>
              <WaLink
                text={cartMessage(items)}
                placement="enquiry_cart"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-wa text-base font-bold text-white"
              >
                <WhatsAppIcon /> Send list on WhatsApp
              </WaLink>
              <button onClick={clear} className="h-11 w-full text-sm font-semibold text-maroon underline underline-offset-4">
                Clear list
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
