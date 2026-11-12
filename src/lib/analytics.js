import site from '../../site.config.js'

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
const STORE = 'saree_utm'

// Remember where the visitor came from (?utm_source=instagram&utm_medium=story ...)
function captureUtm() {
  try {
    const q = new URLSearchParams(window.location.search)
    const found = {}
    KEYS.forEach((k) => q.get(k) && (found[k] = q.get(k).slice(0, 60)))
    if (!found.utm_source && /Instagram/i.test(navigator.userAgent)) found.utm_source = 'instagram'
    if (Object.keys(found).length) sessionStorage.setItem(STORE, JSON.stringify(found))
  } catch {}
}

export function getUtm() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) || '{}')
  } catch {
    return {}
  }
}

function loadScript(src, attrs = {}) {
  const s = document.createElement('script')
  s.src = src
  s.async = true
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v))
  document.head.appendChild(s)
}

export function initAnalytics() {
  captureUtm()
  const { ga4, plausibleDomain } = site.analytics
  const start = () => {
    if (ga4) {
      window.dataLayer = window.dataLayer || []
      window.gtag = function () {
        window.dataLayer.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', ga4)
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${ga4}`)
    }
    if (plausibleDomain) {
      window.plausible =
        window.plausible ||
        function () {
          ;(window.plausible.q = window.plausible.q || []).push(arguments)
        }
      loadScript('https://plausible.io/js/script.js', { 'data-domain': plausibleDomain, defer: '' })
    }
  }
  // Load after the page is interactive so analytics never slows the first paint.
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 4000 })
  else setTimeout(start, 2500)
}

// track('whatsapp_click', { placement: 'product_card', product: 'rani-maroon-banarasi' })
export function track(name, params = {}) {
  const data = { ...params, ...getUtm() }
  try {
    window.gtag?.('event', name, data)
  } catch {}
  try {
    window.plausible?.(name, { props: data })
  } catch {}
  if (name === 'whatsapp_click') {
    // Simple local click counter (per browser) — handy while testing.
    try {
      localStorage.setItem('wa_clicks', String(Number(localStorage.getItem('wa_clicks') || 0) + 1))
    } catch {}
  }
  if (import.meta.env.DEV) console.debug('[track]', name, data)
}
