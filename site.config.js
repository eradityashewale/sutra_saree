// ─────────────────────────────────────────────────────────────
//  ONE PLACE TO EDIT YOUR BRAND DETAILS
//  Everything on the site (text, WhatsApp links, SEO tags,
//  sitemap) reads from this file.
// ─────────────────────────────────────────────────────────────
export default {
  brand: 'Sutra Sarees',
  // Hero headline: each array item is one line.
  headline: ['Six yards', 'of heirloom.'],
  eyebrow: 'Handpicked sarees · Ships across India',
  taglineDevanagari: 'तुमची साडी, तुमची शान',
  description:
    'Handpicked Banarasi, Kanjivaram, silk, cotton and georgette sarees. Browse the collection and order in one tap on WhatsApp.',

  // Your live domain, no trailing slash. Used for product links, Open Graph and the sitemap.
  url: 'https://your-domain.com',

  // WhatsApp Business number: country code + number, digits only (91 + 10 digits for India).
  phone: '910000000000', // ← [PHONE_NUMBER]
  // Optional: WhatsApp Business catalog link, e.g. 'https://wa.me/c/919876543210'
  whatsappCatalog: '',

  instagram: 'instagram_handle', // ← [instagram_handle], without the @
  email: 'hello@your-domain.com',
  city: '[CITY], Maharashtra',

  freeShippingAbove: 2999, // ₹ — shown in the trust strip and FAQ
  exchangeDays: 7, // shown in the FAQ and footer

  founder: {
    name: '[FOUNDER NAME]',
    photo: '/images/founder.svg',
    note: 'Every saree here is one I would hand to my own family. I pick each piece myself, check the weave and the fall, and only then does it go up on the page.',
  },

  // Analytics — leave blank to switch off. No cookie banner is shown either way.
  analytics: {
    ga4: '', // e.g. 'G-XXXXXXXXXX'
    plausibleDomain: '', // e.g. 'your-domain.com'
  },
}
