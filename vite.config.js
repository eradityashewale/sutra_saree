import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import site from './site.config.js'

const products = JSON.parse(
  fs.readFileSync(new URL('./src/data/products.json', import.meta.url), 'utf8'),
)
const base = site.url.replace(/\/$/, '')
const abs = (p) => (p.startsWith('http') ? p : base + p)
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Fills the SEO tags in index.html from site.config.js + products.json,
// and writes sitemap.xml and robots.txt into the build.
function seo() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.brand,
      url: base,
      logo: abs('/favicon.svg'),
      email: site.email,
      address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'IN' },
      sameAs: [`https://www.instagram.com/${site.instagram}/`],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+' + site.phone,
        contactType: 'sales',
        availableLanguage: ['en', 'hi', 'mr'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name,
          description: p.description,
          image: abs(p.image),
          material: p.fabric,
          category: 'Saree',
          brand: { '@type': 'Brand', name: site.brand },
          url: `${base}/?saree=${p.id}`,
          offers: {
            '@type': 'Offer',
            price: p.price,
            priceCurrency: 'INR',
            availability:
              p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `${base}/?saree=${p.id}`,
          },
        },
      })),
    },
  ]
  return {
    name: 'saree-seo',
    transformIndexHtml(html) {
      return html
        .replaceAll('__BRAND__', esc(site.brand))
        .replaceAll('__DESC__', esc(site.description))
        .replaceAll('__URL__', esc(base))
        .replaceAll('__JSONLD__', JSON.stringify(jsonLd).replace(/</g, '\\u003c'))
    },
    generateBundle() {
      const urls = [base + '/', ...products.map((p) => `${base}/?saree=${p.id}`)]
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.map((u) => `  <url><loc>${esc(u)}</loc></url>`).join('\n') +
          `\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  build: { target: 'es2020', chunkSizeWarningLimit: 1200 },
})
