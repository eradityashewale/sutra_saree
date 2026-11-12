// Decides how much 3D a device gets.
//   high   – full cloth, all particles
//   mid    – lighter cloth mesh, fewer particles (most phones)
//   lite   – no WebGL: 2.5D CSS parallax silk
//   static – prefers-reduced-motion: still image, no animation
// Force one for testing with ?tier=lite (or high / mid / static).
export function getTier() {
  if (typeof window === 'undefined') return 'lite'
  const forced = new URLSearchParams(window.location.search).get('tier')
  if (['high', 'mid', 'lite', 'static'].includes(forced)) return forced
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static'

  let webgl = false
  try {
    const c = document.createElement('canvas')
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {}
  if (!webgl) return 'lite'

  const mem = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  if (navigator.connection?.saveData) return 'lite'
  if (mem <= 2 || cores <= 2) return 'lite'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (coarse || mem <= 4 || cores <= 4) return 'mid'
  return 'high'
}

export const hasWebGL = (tier) => tier === 'high' || tier === 'mid'
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -64 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
