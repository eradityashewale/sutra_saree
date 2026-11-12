// The five collections the 3D cloth morphs through on scroll.
// colors: a = body, b = shot-silk / second tone, gold = zari.
// amp = how much the cloth billows, sheen = how glossy it is,
// rot / pos = where the cloth sits for that collection (the "camera move").
export const heroLook = {
  colors: { a: '#5B0F1F', b: '#A3243C', gold: '#C9A24B' },
  amp: 1,
  sheen: 1,
  rot: [-0.55, 0.3, 0.22],
  pos: [1.1, -0.1, 0],
}

export const collections = [
  {
    id: 'Banarasi',
    devanagari: 'बनारसी',
    blurb: 'Zari jaal, broad borders, the weight of a wedding morning.',
    colors: { a: '#6B1023', b: '#C0392B', gold: '#D4AF5A' },
    amp: 0.85,
    sheen: 1.15,
    rot: [-0.35, -0.45, -0.12],
    pos: [1.4, 0.1, 0.4],
  },
  {
    id: 'Kanjivaram',
    devanagari: 'कांजीवरम',
    blurb: 'Temple borders and contrast pallus, woven to outlast us.',
    colors: { a: '#0F4C3A', b: '#A01C5B', gold: '#C9A24B' },
    amp: 0.7,
    sheen: 1.3,
    rot: [-0.7, 0.5, 0.4],
    pos: [1.0, -0.3, 0.8],
  },
  {
    id: 'Silk',
    devanagari: 'रेशीम',
    blurb: 'Soft silks that catch the light and move when you do.',
    colors: { a: '#4A1A5C', b: '#C9698F', gold: '#D9B86A' },
    amp: 1.1,
    sheen: 1.2,
    rot: [-0.2, 0.15, -0.35],
    pos: [1.5, 0.2, 0.2],
  },
  {
    id: 'Cotton',
    devanagari: 'सूती',
    blurb: 'Mulmul, khadi and handblock — for the days that are just days.',
    colors: { a: '#1F3A6E', b: '#DDD3B8', gold: '#B8A27A' },
    amp: 0.9,
    sheen: 0.35,
    rot: [-0.5, -0.25, 0.3],
    pos: [1.2, -0.2, 0.5],
  },
  {
    id: 'Georgette',
    devanagari: 'जॉर्जेट',
    blurb: 'Weightless drapes for long evenings and longer conversations.',
    colors: { a: '#B8436F', b: '#F2B7A0', gold: '#E3C27A' },
    amp: 1.5,
    sheen: 0.7,
    rot: [-0.15, 0.4, 0.1],
    pos: [1.3, 0, 0.3],
  },
]

export const occasions = ['wedding', 'festive', 'office', 'daily wear']

export const priceBands = [
  { id: 'all', label: 'Any price', min: 0, max: Infinity },
  { id: 'u2', label: 'Under ₹2,000', min: 0, max: 1999 },
  { id: '2-5', label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { id: '5-10', label: '₹5,000 – ₹10,000', min: 5001, max: 10000 },
  { id: '10+', label: 'Above ₹10,000', min: 10001, max: Infinity },
]
