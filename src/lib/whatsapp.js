import site from '../../site.config.js'
import { getUtm } from './analytics.js'

export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')

export const productUrl = (p) => `${site.url.replace(/\/$/, '')}/?saree=${p.id}`

// Click-to-chat link with a prefilled, URL-encoded message.
export const waLink = (text) => `https://wa.me/${site.phone}?text=${encodeURIComponent(text)}`

const source = () => {
  const u = getUtm()
  if (!u.utm_source) return ''
  return `\n\n(Found you via ${u.utm_source}${u.utm_medium ? ' ' + u.utm_medium : ''})`
}

export const chatMessage = () => `Hi ${site.brand}, I have a question about your sarees.${source()}`

export const productMessage = (p) =>
  `Hi, I'd like to order this saree:\n\n*${p.name}*\nFabric: ${p.fabric}\nPrice: ${inr(p.price)}\nLink: ${productUrl(p)}${source()}`

export const cartMessage = (items) => {
  const total = items.reduce((s, p) => s + p.price, 0)
  const lines = items
    .map((p, i) => `${i + 1}. *${p.name}*\n   ${p.fabric} · ${inr(p.price)}\n   ${productUrl(p)}`)
    .join('\n')
  return `Hi, I'd like to order these sarees:\n\n${lines}\n\nTotal: ${inr(total)} (${items.length} ${items.length === 1 ? 'saree' : 'sarees'})${source()}`
}

export const enquiryMessage = ({ name, city, type, budget }) =>
  `Hi, I'm looking for a saree.\n\nName: ${name}\nCity: ${city}\nSaree type: ${type}\nBudget: ${budget}${source()}`
