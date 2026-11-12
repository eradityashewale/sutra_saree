# Saree storefront — Instagram → WhatsApp landing site

A mobile-first, single-page storefront: a 3D silk hero, scroll-through collections,
a product grid with 360° drape views, and one-tap ordering on WhatsApp.
Static build, no backend. Products live in one JSON file.

**Stack:** React 19 + Vite · Three.js (React Three Fiber + drei) · GSAP ScrollTrigger · Lenis · Tailwind CSS v4

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # serve the production build locally
```

Needs Node 20 or newer.

## Make it yours (5 edits)

| What | Where |
| --- | --- |
| Brand name, tagline, phone number, Instagram handle, email, city, free-shipping amount, founder note | `site.config.js` |
| Products | `src/data/products.json` |
| Product photos, reel covers, Instagram tiles, founder photo | `public/images/…` |
| Colours and fonts | `src/index.css` (the `@theme` block at the top) + the font links in `index.html` |
| FAQ, testimonials, story text, policies, reels | `src/data/content.js` |

### 1. Brand name, phone number, Instagram handle

Open `site.config.js`. Replace:

- `brand: '[BRAND NAME]'`
- `phone: '910000000000'` → `91` + your 10-digit WhatsApp Business number, digits only
- `instagram: 'instagram_handle'` → your handle without the `@`
- `url` → your live domain (used in the product links inside WhatsApp messages, the share preview and the sitemap)
- `city`, `email`, `freeShippingAbove`, `exchangeDays`, `founder`

The page title, Open Graph tags, JSON-LD schema, `sitemap.xml` and `robots.txt` are all generated from this file at build time.

### 2. Products

Each saree in `src/data/products.json`:

```json
{
  "id": "rani-maroon-banarasi",          // unique, lowercase-with-dashes; becomes the link ?saree=<id>
  "name": "Rani Maroon Banarasi",
  "fabric": "Banarasi",                   // Banarasi | Kanjivaram | Silk | Cotton | Georgette
  "occasion": ["wedding", "festive"],     // wedding | festive | office | daily wear
  "price": 8499,
  "stock": 3,                             // 5 or fewer shows the "Only n left" badge
  "isNew": true,                          // true puts it in the New Arrivals carousel
  "colors": ["#6B1023", "#B3263F"],       // body colour + second tone, used by the 3D drape view
  "image": "/images/products/rani-maroon-banarasi.webp",
  "description": "…",
  "model": null,                          // optional: "/models/saree.glb" for a real 3D model
  "sequence": null                        // optional: ["/images/360/a-01.webp", …] photo spin
}
```

(Remove the `//` comments — JSON does not allow them.)

To add a new fabric or change the scroll-story colours, edit `src/data/collections.js`.

### 3. Photos

Put photos in `public/images/products/` and point `image` at them. Recommended: WebP, 4:5 portrait,
about 1000 × 1250 px, under 150 KB each. The "REPLACE WITH PRODUCT PHOTO" images are
generated placeholders (`npm run placeholders` regenerates them).

Also replace: `public/favicon.svg` (logo), `public/og-image.png` (1200 × 630 share preview),
`public/images/founder.svg`, `public/images/reels/*`, `public/images/instagram/*`.

For looping reels, drop MP4s into `public/videos/` and set `video: '/videos/reel-1.mp4'` in `src/data/content.js`.
Keep them short (5–8 s), 540 × 960, under 1 MB.

### 4. Colours and fonts

`src/index.css`, top of the file:

```css
@theme {
  --color-maroon: #5b0f1f;
  --color-emerald: #0f4c3a;
  --color-gold: #c9a24b;
  --color-ivory: #fbf6ec;
  --color-charcoal: #161616;
  --font-display: 'Bodoni Moda', …;        /* headlines */
  --font-kinetic: 'Clash Display', …;      /* big collection names */
  --font-sans: 'Plus Jakarta Sans', …;     /* body */
  --font-deva: 'Eczar', …;                 /* Marathi / Hindi */
}
```

To swap a font, change the name here **and** the matching `<link>` in `index.html`
(Google Fonts for Bodoni Moda / Plus Jakarta Sans / Eczar, Fontshare for Clash Display).
The colours of the 3D cloth are set per collection in `src/data/collections.js`.

### 5. Testimonials

The three chat cards are **sample placeholders** and are tagged "Sample" on the page.
Replace them in `src/data/content.js` with messages your customers actually sent (ask their permission),
then set `sample: false`.

## How the WhatsApp ordering works

- Every "Order on WhatsApp" button opens `https://wa.me/<phone>?text=<message>` with the saree name,
  fabric, price and a link back to that saree. Message templates are in `src/lib/whatsapp.js`.
- **Enquiry list (cart):** the `+` on a card adds the saree to a list; "Send list on WhatsApp" sends
  them all in one message with a total.
- **Quick enquiry form:** name, city, saree type and budget are composed into a WhatsApp message. Nothing is emailed or stored.
- **Floating "Chat with us" button** on every screen, plus a click-to-chat **QR code** for laptop visitors.
- **WhatsApp catalog:** set `whatsappCatalog` in `site.config.js` and the link appears in the enquiry section and footer.
- A shared link like `your-domain.com/?saree=mayil-kanjivaram` opens that saree directly.

## Instagram

- Use the site as your link in bio: `https://your-domain.com/?utm_source=instagram&utm_medium=bio`
  (use `utm_medium=story` / `reel` for those links). The source is added to the WhatsApp message
  so you can see where each order came from.
- No popups and no cookie wall. Analytics is off until you add an ID in `site.config.js`:
  `analytics.ga4` (Google Analytics 4) or `analytics.plausibleDomain` (Plausible).
  Every WhatsApp tap is sent as a `whatsapp_click` event with its placement and product.

## 3D and performance

| Device | What it gets |
| --- | --- |
| Desktop / strong phones (`high`) | Full cloth mesh, petals and gold dust |
| Most phones (`mid`) | Lighter mesh, fewer particles, capped pixel ratio |
| Low memory, data-saver, no WebGL (`lite`) | 2.5D CSS parallax silk, no three.js download |
| "Reduce motion" switched on (`static`) | Still backdrop, no animation, no smooth scroll |

Test any tier with `?tier=lite` (or `high`, `mid`, `static`). Logic is in `src/lib/device.js`.

- three.js is a separate chunk loaded after first paint; the CSS silk backdrop shows immediately.
- The WebGL loop pauses when the hero is off screen or the tab is hidden.
- **360° view:** by default each saree gets a procedural drape in its own colours. For the real thing, either
  set `model` to a GLB (compress with `npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`;
  KTX2 textures also work if you add drei's `useKTX2`/`KTX2Loader`), or set `sequence` to 24–36 photos taken around the saree.

## Deploy

**Vercel:** push the folder to GitHub → vercel.com → New Project → import the repo → Deploy.
(Framework: Vite, build `npm run build`, output `dist` — already in `vercel.json`.)

**Netlify:** push to GitHub → netlify.com → Add new site → Import → Deploy (settings are in `netlify.toml`).
Or run `npm run build` and drag the `dist` folder onto app.netlify.com/drop.

After the first deploy, set `url` in `site.config.js` to the live address and redeploy so the
WhatsApp product links and share preview point to the right place.

## Folder structure

```
site.config.js            brand details (edit first)
index.html                fonts, SEO tags (filled in at build time)
vite.config.js            build + SEO/sitemap generator
public/                   images, favicon, share image
scripts/make-placeholders.mjs
src/
  main.jsx, App.jsx       entry + page assembly, smooth scroll
  index.css               theme tokens, glass, tilt, fallback silk
  data/
    products.json         the 12 sarees
    collections.js        collections, 3D looks, filters
    content.js            reels, Instagram, testimonials, FAQ, story, policies
  lib/
    whatsapp.js           wa.me links + message templates
    analytics.js          UTM capture, GA4 / Plausible, click tracking
    enquiry.jsx           enquiry list ("cart on WhatsApp")
    device.js             device tiers, reduced motion
    stage.js              scroll/pointer state shared with WebGL
  three/
    silkShader.js         GLSL: cloth waves, silk sheen, zari, glints
    SilkCloth.jsx         hero cloth that recolours per collection
    Particles.jsx         marigold petals + gold dust
    SilkScene.jsx         hero canvas
    DrapeViewer3D.jsx     360° viewer (GLB or procedural drape)
  components/
    Nav, Stage (hero + scroll story), Shop (trust strip, bento grid, new arrivals),
    ProductCard, ProductModal, Sections (reels, Instagram, story, testimonials,
    FAQ, enquiry, footer), Floating (WhatsApp button, enquiry drawer, loader), ui
```
