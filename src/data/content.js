import site from '../../site.config.js'

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN')

// "Shop the Reel" tiles. Put your reel as an MP4 in /public/videos and set `video`.
// Without a video the poster image is shown with a slow zoom.
export const reels = [
  { poster: '/images/reels/reel-1.svg', video: null, caption: 'Draping the Rani Maroon', productId: 'rani-maroon-banarasi' },
  { poster: '/images/reels/reel-2.svg', video: null, caption: 'Kanjivaram, up close', productId: 'mayil-kanjivaram' },
  { poster: '/images/reels/reel-3.svg', video: null, caption: 'Office-ready in soft silk', productId: 'mogra-soft-silk' },
  { poster: '/images/reels/reel-4.svg', video: null, caption: 'Indigo for every day', productId: 'indigo-handblock-cotton' },
  { poster: '/images/reels/reel-5.svg', video: null, caption: 'Evening georgette', productId: 'midnight-sequin-georgette' },
]

// Instagram grid: export six of your posts into /public/images/instagram.
export const instagramPosts = [1, 2, 3, 4, 5, 6].map((n) => ({
  image: `/images/instagram/post-${n}.svg`,
  alt: `Instagram post ${n} from @${site.instagram}`,
}))

// ⚠ SAMPLE CONTENT. These are layout placeholders, not real reviews.
// Replace them with messages your customers have actually sent (with their permission),
// then set `sample: false` to remove the "Sample" tag on the page.
export const testimonials = [
  {
    sample: true,
    name: 'Customer name',
    city: 'City',
    time: '7:42 pm',
    messages: [
      'Paste a real customer message here.',
      'A second line from the same chat works well, for example what they said after the saree arrived.',
    ],
    reply: 'Your reply to them goes here.',
  },
  {
    sample: true,
    name: 'Customer name',
    city: 'City',
    time: '11:05 am',
    messages: ['Paste a real customer message here.'],
    reply: 'Your reply to them goes here.',
  },
  {
    sample: true,
    name: 'Customer name',
    city: 'City',
    time: '4:18 pm',
    messages: [
      'Paste a real customer message here.',
      'Photos of customers wearing the saree can go in the Instagram grid.',
    ],
    reply: 'Your reply to them goes here.',
  },
]

// Edit these answers so they match your actual policies.
export const faqs = [
  {
    q: 'How does shipping work?',
    a: `We ship across India. Orders above ${inr(site.freeShippingAbove)} ship free; below that, shipping is calculated on WhatsApp before you pay. Most orders are dispatched in 1–2 working days and you get a tracking link on WhatsApp.`,
  },
  {
    q: 'Can I return or exchange a saree?',
    a: `Yes. If something is not right, message us within ${site.exchangeDays} days of delivery for an exchange. The saree should be unused, unwashed and with its tags. Please record an unboxing video so we can sort out any damage claim quickly.`,
  },
  {
    q: 'Do you offer blouse stitching?',
    a: 'Most sarees come with an unstitched blouse piece. We can arrange stitching, fall and pico on request. Share your measurements on WhatsApp and we will confirm the charge and the extra days needed.',
  },
  {
    q: 'Do you take custom or bulk orders?',
    a: 'We do, for weddings, return gifts and matching family sets. Tell us the occasion, number of sarees and your budget on WhatsApp and we will send options.',
  },
  {
    q: 'How do I pay?',
    a: 'UPI (GPay, PhonePe, Paytm or any UPI app) is the quickest. Cash on Delivery is available on most pin codes. Payment details are shared on WhatsApp once you confirm your order.',
  },
  {
    q: 'Will the colour match the photos?',
    a: 'We photograph in daylight and do not edit the colours, but screens vary a little. Ask us for a quick video of the saree on WhatsApp before you order.',
  },
]

// "Our Story" copy. Rewrite this in your own words.
export const story = {
  headline: 'Chosen by hand, one saree at a time.',
  weaver:
    'Behind every saree is a loom, a pair of hands and days of patient work. We buy in small lots, so the weave you see is the weave you get, and the people who made it are paid fairly for it.',
}

// Short policy text shown in the footer. Replace with your actual policies.
export const policies = {
  privacy:
    'We only collect what you choose to send us on WhatsApp (your name, address and phone number) and use it to deliver your order. This site shows no ads and sets no advertising cookies. If analytics is switched on, it counts visits and button taps without identifying you.',
  returns: `Exchanges are accepted within ${site.exchangeDays} days of delivery for unused, unwashed sarees with tags. Please share an unboxing video for any damage claim. Custom-stitched blouses and sale items cannot be exchanged.`,
}
