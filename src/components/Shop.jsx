import { useMemo, useRef } from 'react'
import products from '../data/products.json'
import { collections, occasions, priceBands } from '../data/collections.js'
import site from '../../site.config.js'
import ProductCard from './ProductCard.jsx'
import { Icon, paths, Reveal, SectionHead } from './ui.jsx'

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')

/* ── Trust strip ──────────────────────────────────────────────── */
export function TrustStrip() {
  const items = [
    { icon: paths.truck, label: `Free shipping above ${inr(site.freeShippingAbove)}` },
    { icon: paths.cash, label: 'Cash on Delivery' },
    { icon: paths.swap, label: 'Easy exchange' },
    { icon: paths.leaf, label: 'Handpicked fabrics' },
  ]
  return (
    <section aria-label="Why shop with us" className="border-b border-maroon/10 bg-ivory">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-5 py-7 sm:px-10 md:grid-cols-4">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-3 text-sm font-semibold text-charcoal">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-maroon/8 text-maroon">
              <Icon d={it.icon} />
            </span>
            {it.label}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`h-11 shrink-0 rounded-full border px-4 text-sm font-semibold capitalize transition ${
        active ? 'border-maroon bg-maroon text-ivory' : 'border-maroon/25 bg-white/60 text-charcoal hover:border-maroon'
      }`}
    >
      {children}
    </button>
  )
}

/* ── Collections bento grid with filters ──────────────────────── */
export function Shop({ filters, setFilters, onView }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: f[k] === v ? 'all' : v }))
  const band = priceBands.find((b) => b.id === filters.price) || priceBands[0]

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (filters.fabric === 'all' || p.fabric === filters.fabric) &&
          (filters.occasion === 'all' || p.occasion.includes(filters.occasion)) &&
          p.price >= band.min &&
          p.price <= band.max,
      ),
    [filters, band],
  )
  const bento = list.length >= 5
  const filtered = filters.fabric !== 'all' || filters.occasion !== 'all' || filters.price !== 'all'

  return (
    <section id="shop" aria-labelledby="shop-title" className="bg-ivory px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHead eyebrow="The collection" title="Find your saree" id="shop-title">
          Tap any saree to turn it around in 360°, then order it on WhatsApp in one tap.
        </SectionHead>

        <div className="mb-8 space-y-3">
          <div role="group" aria-label="Filter by fabric" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            <Chip active={filters.fabric === 'all'} onClick={() => setFilters((f) => ({ ...f, fabric: 'all' }))}>
              All fabrics
            </Chip>
            {collections.map((c) => (
              <Chip key={c.id} active={filters.fabric === c.id} onClick={() => set('fabric', c.id)}>
                {c.id}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Filter by occasion" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {occasions.map((o) => (
                <Chip key={o} active={filters.occasion === o} onClick={() => set('occasion', o)}>
                  {o}
                </Chip>
              ))}
            </div>
            <label className="sr-only" htmlFor="price-filter">
              Filter by price
            </label>
            <select
              id="price-filter"
              value={filters.price}
              onChange={(e) => setFilters((f) => ({ ...f, price: e.target.value }))}
              className="h-11 rounded-full border border-maroon/25 bg-white/60 px-4 text-sm font-semibold text-charcoal"
            >
              {priceBands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
            {filtered && (
              <button
                onClick={() => setFilters({ fabric: 'all', occasion: 'all', price: 'all' })}
                className="h-11 px-2 text-sm font-semibold text-maroon underline underline-offset-4"
              >
                Clear filters
              </button>
            )}
          </div>
          <p aria-live="polite" className="text-sm text-charcoal/70">
            {list.length} {list.length === 1 ? 'saree' : 'sarees'}
          </p>
        </div>

        {list.length === 0 ? (
          <p className="rounded-[24px] border border-dashed border-maroon/30 p-10 text-center text-charcoal/75">
            Nothing matches those filters yet. Clear a filter, or message us on WhatsApp and we will help you find one.
          </p>
        ) : (
          <div className="grid grid-flow-dense grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {list.map((p, i) => {
              const big = bento && i % 6 === 0
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  onView={onView}
                  big={big}
                  className={`aspect-[3/4] ${big ? 'col-span-2 row-span-2' : ''}`}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/* ── New arrivals carousel ────────────────────────────────────── */
export function NewArrivals({ onView }) {
  const track = useRef()
  const list = products.filter((p) => p.isNew)
  const move = (dir) => track.current.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section id="new" aria-labelledby="new-title" className="overflow-hidden bg-maroon px-5 py-16 text-ivory sm:px-10 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <SectionHead eyebrow="Just in" title="New arrivals" id="new-title" dark />
          <div className="mb-8 hidden gap-2 sm:mb-12 sm:flex">
            <button onClick={() => move(-1)} aria-label="Previous sarees" className="grid h-12 w-12 place-items-center rounded-full border border-ivory/40 transition hover:bg-ivory hover:text-maroon">
              <Icon d={paths.left} />
            </button>
            <button onClick={() => move(1)} aria-label="Next sarees" className="grid h-12 w-12 place-items-center rounded-full border border-ivory/40 transition hover:bg-ivory hover:text-maroon">
              <Icon d={paths.right} />
            </button>
          </div>
        </div>
        <Reveal>
          <div
            ref={track}
            tabIndex={0}
            role="group"
            aria-label="New arrivals carousel, swipe or use arrow keys"
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-10 sm:gap-6 sm:px-10"
          >
            {list.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={onView}
                big
                className="aspect-[3/4] w-[78vw] max-w-[360px] shrink-0 snap-center"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
