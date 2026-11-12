import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import site from '../../site.config.js'
import products from '../data/products.json'
import { collections, priceBands } from '../data/collections.js'
import { faqs, instagramPosts, policies, reels, story, testimonials } from '../data/content.js'
import { track } from '../lib/analytics.js'
import { chatMessage, enquiryMessage, productMessage, waLink } from '../lib/whatsapp.js'
import { Icon, InstagramIcon, Magnetic, paths, Reveal, SectionHead, WaLink, WhatsAppIcon } from './ui.jsx'

const ig = `https://www.instagram.com/${site.instagram}/`

/* ── Shop the Reel ────────────────────────────────────────────── */
function ReelTile({ reel }) {
  const video = useRef()
  const product = products.find((p) => p.id === reel.productId)
  useEffect(() => {
    // Play only while on screen: saves data and battery.
    const v = video.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.4 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <figure className="relative aspect-[9/16] w-[62vw] max-w-[280px] shrink-0 snap-center overflow-hidden rounded-[24px] bg-charcoal shadow-soft">
      {reel.video ? (
        <video ref={video} src={reel.video} poster={reel.poster} muted loop playsInline preload="none" aria-label={reel.caption} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <img src={reel.poster} alt={reel.caption} loading="lazy" decoding="async" className="kenburns absolute inset-0 h-full w-full object-cover" />
      )}
      <figcaption className="glass-dark absolute inset-x-2 bottom-2 rounded-[18px] p-3 text-ivory">
        <p className="text-sm font-semibold leading-snug">{reel.caption}</p>
        {product && (
          <WaLink
            text={productMessage(product)}
            placement="reel"
            product={product.id}
            className="mt-2 inline-flex h-10 items-center gap-1.5 rounded-full bg-gold px-4 text-xs font-bold text-charcoal"
          >
            <WhatsAppIcon className="h-4 w-4" /> Order this look
          </WaLink>
        )}
      </figcaption>
    </figure>
  )
}

export function ShopTheReel() {
  return (
    <section aria-labelledby="reel-title" className="overflow-hidden bg-ivory px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="As seen on Instagram" title="Shop the reel" id="reel-title">
          Liked it in a reel? Find the same saree here and order it straight away.
        </SectionHead>
        <Reveal>
          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-10 sm:px-10">
            {reels.map((r) => (
              <ReelTile key={r.poster} reel={r} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Instagram grid ───────────────────────────────────────────── */
export function InstagramGrid() {
  return (
    <section aria-labelledby="ig-title" className="bg-emerald px-5 py-16 text-ivory sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead eyebrow="Instagram" title={`@${site.instagram}`} id="ig-title" dark />
          <Magnetic className="mb-8 sm:mb-12">
            <a
              href={ig}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('instagram_click', { placement: 'grid' })}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ivory px-6 text-sm font-bold text-emerald transition hover:bg-gold hover:text-charcoal"
            >
              <InstagramIcon /> Follow @{site.instagram}
            </a>
          </Magnetic>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6">
          {instagramPosts.map((post, i) => (
            <Reveal as="li" key={post.image} delay={i * 0.05}>
              <a href={ig} target="_blank" rel="noopener noreferrer" className="group block aspect-square overflow-hidden rounded-2xl sm:rounded-[24px]">
                <img src={post.image} alt={post.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── Our Story ────────────────────────────────────────────────── */
export function OurStory({ animate }) {
  const ref = useRef()
  useEffect(() => {
    if (!animate) return
    // Words light up one after another as the section scrolls through.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.story-word',
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: '.story-text', start: 'top 82%', end: 'bottom 50%', scrub: true } },
      )
    }, ref)
    return () => ctx.revert()
  }, [animate])
  return (
    <section ref={ref} id="story" aria-labelledby="story-title" className="bg-ivory px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <Reveal className="relative">
          <img
            src={site.founder.photo}
            alt={`${site.founder.name}, founder of ${site.brand}`}
            loading="lazy"
            decoding="async"
            width="800"
            height="1000"
            className="aspect-[4/5] w-full rounded-[24px] object-cover shadow-soft"
          />
          <div className="glass-dark absolute inset-x-3 bottom-3 rounded-[18px] p-4 text-ivory">
            <p className="font-display text-lg italic leading-snug">“{site.founder.note}”</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold">{site.founder.name} · Founder</p>
          </div>
        </Reveal>
        <div>
          <p className="font-kinetic text-xs font-semibold uppercase tracking-[0.22em] text-maroon">Our story</p>
          <h2 id="story-title" className="story-text font-display mt-4 text-[clamp(2.2rem,6.5vw,4.6rem)] font-medium leading-[1.02] tracking-tight" aria-label={story.headline}>
            {story.headline.split(' ').map((w, i) => (
              <span key={i} aria-hidden="true" className="story-word inline-block">
                {w}&nbsp;
              </span>
            ))}
          </h2>
          <Reveal>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-charcoal/80">{story.weaver}</p>
            <p lang="mr" className="font-deva mt-6 text-3xl text-maroon">
              {site.taglineDevanagari}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Customer love: WhatsApp-style chat cards ─────────────────── */
export function Testimonials() {
  return (
    <section aria-labelledby="love-title" className="bg-[#efe7d8] px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="Customer love" title="Straight from our chats" id="love-title" />
        <ul className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={i} delay={i * 0.08} className="overflow-hidden rounded-[24px] bg-[#e7ddd0] shadow-soft">
              <div className="flex items-center gap-3 bg-[#0b5c4a] px-4 py-3 text-white">
                <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-sm font-bold">
                  {t.name[0]}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {t.name} <span className="font-normal opacity-80">· {t.city}</span>
                </p>
                {t.sample && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0b5c4a]">Sample</span>}
              </div>
              <div className="space-y-2 p-4 text-[15px] leading-snug text-charcoal">
                {t.messages.map((m, j) => (
                  <p key={j} className="mr-8 w-fit rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">
                    {m}
                    {j === t.messages.length - 1 && <span className="ml-2 align-bottom text-[10px] text-charcoal/60">{t.time}</span>}
                  </p>
                ))}
                <p className="ml-8 w-fit justify-self-end rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 shadow-sm" style={{ marginLeft: 'auto' }}>
                  {t.reply} <span className="ml-1 align-bottom text-[10px] text-[#0b6fb8]">✓✓</span>
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── FAQ ──────────────────────────────────────────────────────── */
export function FAQ() {
  return (
    <section aria-labelledby="faq-title" className="bg-ivory px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <SectionHead eyebrow="Good to know" title="Questions, answered" id="faq-title">
          Something else on your mind? Ask us on WhatsApp — a real person replies.
        </SectionHead>
        <div className="divide-y divide-maroon/15 border-y border-maroon/15">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-left text-lg font-semibold">
                {f.q}
                <Icon d={paths.plus} className="faq-plus h-5 w-5 shrink-0 text-maroon transition-transform duration-300" />
              </summary>
              <p className="pb-5 pr-8 leading-relaxed text-charcoal/80">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Quick enquiry: composes a WhatsApp message (no email, no backend) ── */
export function QuickEnquiry() {
  const [form, setForm] = useState({ name: '', city: '', type: 'Any', budget: 'Flexible' })
  const [qr, setQr] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const box = useRef()

  useEffect(() => {
    // Build the click-to-chat QR only when this section is near the screen.
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        import('qrcode').then((m) =>
          (m.default || m)
            .toDataURL(waLink(chatMessage()), { margin: 1, width: 360, color: { dark: '#161616', light: '#FBF6EC' } })
            .then(setQr),
        )
      },
      { rootMargin: '400px' },
    )
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  const submit = (e) => {
    e.preventDefault()
    track('whatsapp_click', { placement: 'quick_enquiry' })
    const url = waLink(enquiryMessage(form))
    if (!window.open(url, '_blank', 'noopener')) window.location.href = url
  }
  const field = 'mt-1.5 h-12 w-full rounded-2xl border border-ivory/30 bg-white/10 px-4 text-base text-ivory placeholder:text-ivory/50'

  return (
    <section ref={box} id="enquiry" aria-labelledby="enq-title" className="bg-charcoal px-5 py-16 text-ivory sm:px-10 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <SectionHead eyebrow="Quick enquiry" title="Tell us what you are looking for" id="enq-title" dark>
            Four quick answers and we will send you options on WhatsApp.
          </SectionHead>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Your name
              <input required autoComplete="name" value={form.name} onChange={set('name')} className={field} placeholder="Name" />
            </label>
            <label className="text-sm font-semibold">
              City
              <input required autoComplete="address-level2" value={form.city} onChange={set('city')} className={field} placeholder="City" />
            </label>
            <label className="text-sm font-semibold">
              Saree type
              <select value={form.type} onChange={set('type')} className={`${field} [&>option]:text-charcoal`}>
                <option>Any</option>
                {collections.map((c) => (
                  <option key={c.id}>{c.id}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Budget
              <select value={form.budget} onChange={set('budget')} className={`${field} [&>option]:text-charcoal`}>
                <option>Flexible</option>
                {priceBands.slice(1).map((b) => (
                  <option key={b.id}>{b.label}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gold px-8 text-base font-bold text-charcoal transition hover:bg-ivory sm:col-span-2 sm:justify-self-start">
              <WhatsAppIcon /> Send on WhatsApp
            </button>
          </form>
        </div>
        <Reveal className="glass flex flex-col items-center justify-center rounded-[24px] p-8 text-center">
          <div className="grid h-52 w-52 place-items-center overflow-hidden rounded-2xl bg-ivory">
            {qr ? <img src={qr} alt={`QR code to chat with ${site.brand} on WhatsApp`} width="208" height="208" className="h-full w-full" /> : <span className="text-sm text-charcoal/60">Loading QR…</span>}
          </div>
          <p className="font-display mt-6 text-2xl">Scan to chat</p>
          <p className="mt-2 max-w-xs text-sm text-ivory/80">On a laptop? Point your phone camera at the code to open our WhatsApp chat.</p>
          {site.whatsappCatalog && (
            <a
              href={site.whatsappCatalog}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { placement: 'catalog' })}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full border border-ivory/50 px-6 text-sm font-bold transition hover:bg-ivory hover:text-charcoal"
            >
              Browse our WhatsApp catalog <Icon d={paths.arrow} className="h-4 w-4" />
            </a>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/* ── Footer ───────────────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className="bg-maroon px-5 pb-28 pt-16 text-ivory sm:px-10 sm:pb-16">
      <div className="mx-auto max-w-7xl">
        <p aria-hidden="true" className="font-display text-[clamp(2.6rem,11vw,9rem)] font-medium leading-none tracking-tight text-gold">
          {site.brand}
        </p>
        <div className="mt-10 grid gap-10 border-t border-ivory/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Talk to us</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <WaLink text={chatMessage()} placement="footer" className="inline-flex items-center gap-2 hover:text-gold">
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </WaLink>
              </li>
              <li>
                <a href={ig} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold">
                  <InstagramIcon className="h-4 w-4" /> @{site.instagram}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-gold">
                  {site.email}
                </a>
              </li>
              <li className="text-ivory/80">{site.city}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">We accept</h3>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
              {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Cash on Delivery'].map((m) => (
                <li key={m} className="rounded-lg border border-ivory/40 px-3 py-2">
                  {m}
                </li>
              ))}
            </ul>
            {site.whatsappCatalog && (
              <a href={site.whatsappCatalog} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm underline underline-offset-4 hover:text-gold">
                WhatsApp catalog
              </a>
            )}
          </div>
          <div className="sm:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Policies</h3>
            <details id="privacy" className="mt-3 border-b border-ivory/20">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between text-sm font-semibold">
                Privacy policy <Icon d={paths.plus} className="faq-plus h-4 w-4 transition-transform" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-ivory/85">{policies.privacy}</p>
            </details>
            <details id="returns" className="border-b border-ivory/20">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between text-sm font-semibold">
                Return &amp; exchange policy <Icon d={paths.plus} className="faq-plus h-4 w-4 transition-transform" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-ivory/85">{policies.returns}</p>
            </details>
          </div>
        </div>
        <p className="mt-10 text-xs text-ivory/70">
          © {new Date().getFullYear()} {site.brand}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
