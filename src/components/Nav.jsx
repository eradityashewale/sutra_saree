import { useEffect, useState } from 'react'
import site from '../../site.config.js'
import { useEnquiry } from '../lib/enquiry.jsx'
import { chatMessage } from '../lib/whatsapp.js'
import { Icon, paths, WaLink, WhatsAppIcon } from './ui.jsx'

const links = [
  { href: '#collections', label: 'Collections' },
  { href: '#new', label: 'New Arrivals' },
  { href: '#story', label: 'About' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const { ids, setOpen } = useEnquiry()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const ig = `https://www.instagram.com/${site.instagram}/`

  return (
    <nav aria-label="Main" className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`mx-auto flex max-w-7xl items-center gap-2 rounded-full px-4 py-2 text-ivory transition-all duration-500 sm:px-6 ${
          scrolled || menu ? 'glass-dark' : 'border border-transparent'
        }`}
      >
        <a href="#top" className="font-display mr-auto truncate text-lg font-semibold tracking-tight sm:text-xl" aria-label={`${site.brand} home`}>
          {site.brand}
        </a>
        <ul className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-gold">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={ig} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
              Instagram
            </a>
          </li>
        </ul>
        {ids.length > 0 && (
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open enquiry list, ${ids.length} sarees`}
            className="relative ml-2 grid h-11 w-11 place-items-center rounded-full border border-ivory/30"
          >
            <Icon d={paths.bag} />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-charcoal">
              {ids.length}
            </span>
          </button>
        )}
        <WaLink
          text={chatMessage()}
          placement="nav"
          className="ml-2 inline-flex h-11 items-center gap-2 rounded-full bg-gold px-4 text-sm font-bold text-charcoal transition hover:bg-ivory sm:px-5"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span className="hidden min-[400px]:inline">Order on WhatsApp</span>
          <span className="min-[400px]:hidden">Order</span>
        </WaLink>
        <button
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label="Menu"
          className="grid h-11 w-11 place-items-center rounded-full md:hidden"
        >
          <Icon d={menu ? paths.close : paths.menu} />
        </button>
      </div>
      {menu && (
        <ul id="mobile-menu" className="glass-dark mx-auto mt-2 max-w-7xl rounded-3xl p-3 text-ivory md:hidden">
          {[...links, { href: ig, label: 'Instagram', ext: true }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                {...(l.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => setMenu(false)}
                className="font-display block rounded-2xl px-4 py-3 text-2xl"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
