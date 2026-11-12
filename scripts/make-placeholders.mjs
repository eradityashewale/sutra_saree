// Generates the placeholder artwork in /public (product images, reel posters,
// Instagram tiles, founder photo, share image). The logo and favicon
// (public/logo.svg, public/logo-mark.svg, public/favicon.svg) are hand-made, not generated.
// Run:  npm run placeholders
// You only need this until you drop in your real photos.
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = (p) => path.join(root, 'public', p)
const products = JSON.parse(fs.readFileSync(path.join(root, 'src/data/products.json'), 'utf8'))
const GOLD = '#C9A24B'

function drape({ a, b, w, h, label, sub }) {
  const folds = Array.from({ length: 6 }, (_, i) => {
    const x = (i * w) / 6
    return `<rect x="${x}" y="0" width="${w / 6}" height="${h}" fill="url(#f)"/>`
  }).join('')
  const zig = Array.from({ length: Math.ceil(w / 40) + 1 }, (_, i) => `${i * 40},${h - 150} ${i * 40 + 20},${h - 180}`).join(' ')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
<linearGradient id="f" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".3"/><stop offset=".45" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<pattern id="b" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M35 23l9 12-9 12-9-12z" fill="${GOLD}" opacity=".6"/></pattern>
</defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<rect width="${w}" height="${h - 150}" fill="url(#b)"/>
<polygon points="0,${h} 0,${h - 150} ${zig} ${w},${h - 150} ${w},${h}" fill="${GOLD}"/>
<rect y="${h - 96}" width="${w}" height="10" fill="${a}" opacity=".8"/>
<rect y="${h - 60}" width="${w}" height="4" fill="${a}" opacity=".8"/>
${folds}
<g font-family="Georgia, serif" text-anchor="middle" fill="#fff">
<text x="${w / 2}" y="${h * 0.44}" font-size="${w / 16}" opacity=".95">${label}</text>
<text x="${w / 2}" y="${h * 0.44 + w / 14}" font-size="${w / 30}" opacity=".75" font-family="Arial, sans-serif" letter-spacing="3">${sub}</text>
</g>
</svg>`
}

const write = (p, s) => {
  fs.mkdirSync(path.dirname(pub(p)), { recursive: true })
  fs.writeFileSync(pub(p), s)
}

for (const p of products) {
  write(p.image, drape({ a: p.colors[0], b: p.colors[1], w: 800, h: 1000, label: p.name, sub: 'REPLACE WITH PRODUCT PHOTO' }))
}
;[0, 2, 4, 7, 10].forEach((pi, i) => {
  const p = products[pi]
  write(`/images/reels/reel-${i + 1}.svg`, drape({ a: p.colors[1], b: p.colors[0], w: 540, h: 960, label: `Reel ${i + 1}`, sub: 'REPLACE WITH REEL COVER' }))
})
;[1, 3, 5, 6, 9, 11].forEach((pi, i) => {
  const p = products[pi]
  write(`/images/instagram/post-${i + 1}.svg`, drape({ a: p.colors[0], b: p.colors[1], w: 600, h: 600, label: `Post ${i + 1}`, sub: 'REPLACE WITH INSTAGRAM POST' }))
})
write('/images/founder.svg', drape({ a: '#0F4C3A', b: '#5B0F1F', w: 800, h: 1000, label: 'Founder photo', sub: 'REPLACE WITH YOUR PHOTO' }))


// Share image (Open Graph needs PNG/JPG). Needs rsvg-convert; otherwise replace public/og-image.png by hand.
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#161616"/><stop offset=".55" stop-color="#5B0F1F"/><stop offset="1" stop-color="#8E1B33"/></linearGradient>
<pattern id="b" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M35 23l9 12-9 12-9-12z" fill="${GOLD}" opacity=".35"/></pattern></defs>
<rect width="1200" height="630" fill="url(#g)"/><rect x="640" width="560" height="630" fill="url(#b)"/>
<rect y="560" width="1200" height="70" fill="${GOLD}"/>
<text x="80" y="290" font-family="Georgia, serif" font-size="96" fill="#FBF6EC">Six yards</text>
<text x="80" y="400" font-family="Georgia, serif" font-size="96" font-style="italic" fill="${GOLD}">of heirloom.</text>
<text x="80" y="480" font-family="Arial, sans-serif" font-size="30" fill="#FBF6EC" opacity=".85">Handpicked sarees · Order on WhatsApp</text>
</svg>`
const tmp = path.join(root, 'scripts', '.og.svg')
fs.writeFileSync(tmp, og)
try {
  execSync(`rsvg-convert -w 1200 -h 630 "${tmp}" -o "${pub('/og-image.png')}"`)
} catch {
  console.warn('rsvg-convert not found: keeping the existing public/og-image.png')
}
fs.rmSync(tmp, { force: true })
console.log('Placeholders written to /public')
