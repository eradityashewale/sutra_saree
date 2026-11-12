import { useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import products from './data/products.json'
import { track } from './lib/analytics.js'
import { getTier, scrollToId } from './lib/device.js'
import Nav from './components/Nav.jsx'
import Stage from './components/Stage.jsx'
import { NewArrivals, Shop, TrustStrip } from './components/Shop.jsx'
import { FAQ, Footer, InstagramGrid, OurStory, QuickEnquiry, ShopTheReel, Testimonials } from './components/Sections.jsx'
import { EnquiryDrawer, FloatingWhatsApp, Loader } from './components/Floating.jsx'
import ProductModal from './components/ProductModal.jsx'
import { CursorGlow } from './components/ui.jsx'

export default function App() {
  const [tier] = useState(getTier)
  const [filters, setFilters] = useState({ fabric: 'all', occasion: 'all', price: 'all' })
  // A shared product link (?saree=<id>) opens that saree straight away.
  const [product, setProduct] = useState(() => {
    const id = new URLSearchParams(window.location.search).get('saree')
    return products.find((p) => p.id === id) || null
  })

  // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (tier === 'static') return
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -64 } })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [tier])

  // Page height changes when filters change or images load: re-measure scroll triggers.
  useEffect(() => {
    ScrollTrigger.refresh()
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [filters])

  const view = useCallback((p) => {
    setProduct(p)
    track('view_item', { product: p.id })
  }, [])
  const close = useCallback(() => setProduct(null), [])
  const shopFabric = useCallback((fabric) => {
    setFilters((f) => ({ ...f, fabric }))
    scrollToId('shop')
  }, [])

  return (
    <>
      {tier !== 'static' && <Loader />}
      <a href="#shop" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-bold focus:text-charcoal">
        Skip to sarees
      </a>
      <Nav />
      <main id="top">
        <Stage tier={tier} onShop={shopFabric} />
        <TrustStrip />
        <Shop filters={filters} setFilters={setFilters} onView={view} />
        <NewArrivals onView={view} />
        <ShopTheReel />
        <InstagramGrid />
        <OurStory animate={tier !== 'static'} />
        <Testimonials />
        <FAQ />
        <QuickEnquiry />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <EnquiryDrawer />
      {product && <ProductModal product={product} tier={tier} onClose={close} />}
      <CursorGlow />
    </>
  )
}
