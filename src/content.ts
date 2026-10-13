/**
 * Every word, number, address and picture on the site lives here — change it
 * once and every page follows. Copy is drawn from Eastco's previous site and
 * its September 2026 catalogues.
 */

import {url} from './lib/url';

export type Photo = {src: string; alt: string; w: number; h: number; credit?: string};

const ev = (file: string, w: number, h: number, alt: string, credit?: string): Photo => ({
  src: url(`/images/events/${file}.webp`),
  w,
  h,
  alt,
  credit,
});

const OBSESSION = 'Obsession Photography';
const SALT = 'SALT Photography by Anel';
const CELESTE = 'Celeste Cilliers Photography';

/** Every photograph on the site, with a real description of what is in it. */
export const photos = {
  dolceTable: ev('event-dolce-2', 1280, 853, 'Overhead view of a long timber table dressed with a white chiffon runner, red and blush roses, gold candelabra and gold cutlery.', SALT),
  dolceArbour: ev('event-dolce-1', 853, 1280, 'An outdoor wedding table under a vine arbour and festoon lights, with black metal chairs, a white runner, red roses and brass milk churns.', SALT),
  dolceBride: ev('event-dolce-4', 853, 1280, 'A bride in a blush tulle gown and rose crown seated beside the reception table under festoon lights.', SALT),
  obsessionsTable: ev('event-obsessions-1', 1000, 667, 'A grey-linen table with blush tulips, white hydrangeas, crystal candle holders, black vases and pink napkins.', OBSESSION),
  obsessionsBouquet: ev('event-obsessions-3', 667, 1000, 'A bride by a window holding a bouquet of pampas, orchids and white roses.', OBSESSION),
  obsessionsFlowers: ev('event-obsessions-4', 667, 1000, 'A bride seated in a rattan chair in front of giant white and lilac paper flowers.', OBSESSION),
  belleCloche: ev('event-belle-1', 1024, 1280, 'Hands holding a glass cloche over a single yellow rose against a ruffled ivory gown.', CELESTE),
  belleCandles: ev('event-belle-2', 1022, 1280, 'A garden table set with crystal glassware, lit tapered candles, a gold candelabra, yellow and white florals and an ivory mantel clock.', CELESTE),
  belleAvenue: ev('event-belle-4', 720, 1280, 'A tree-lined gravel avenue between clipped hedges at the venue.', CELESTE),
  florals: ev('gallery-01', 1000, 667, 'Blush tulips, peonies and white hydrangeas in black vases beside a crystal candle holder and pink linen napkins.', OBSESSION),
  thankYou: ev('gallery-02', 667, 1000, 'Hands holding a printed thank-you card tied with a blush tassel.', OBSESSION),
  favours: ev('gallery-03', 1000, 667, 'Hands holding a white favour box of pink chocolate truffles beside a bottle of rosé.', OBSESSION),
  pearls: ev('gallery-04', 1000, 667, 'Pearl drop earrings and a floral bridal hair comb laid on blush tulle.', OBSESSION),
  menu: ev('gallery-05', 667, 1000, 'A knotted blush linen napkin and a printed menu card on a black charger plate.', OBSESSION),
  brideTable: ev('gallery-06', 1000, 667, 'A bride seated at a grey-linen table styled with blush florals, crystal glassware and black chairs.', OBSESSION),
  brideCandle: ev('gallery-07', 667, 1000, 'A bride leaning on a table of pampas, florals and a charcoal pillar candle.', OBSESSION),
  velvetChair: ev('gallery-08', 667, 1000, 'A bride in a blush velvet chair surrounded by oversized paper flowers.', OBSESSION),
  blueTable: ev('gallery-09', 720, 960, 'A garden table with blue-and-white printed linen, cobalt goblets, white orchids, blue hydrangeas and lemons.'),
  terracotta: ev('gallery-10', 720, 960, 'A long white table with knotted terracotta napkins, woven placemats, bamboo chairs, white orchids and lit tapered candles.'),
};

export const brand = {
  name: 'Eastco Decor Hire',
  short: 'Eastco',
  wordmark: 'EASTCO',
  tagline: ['Events · Décor · Hire', 'Centurion & Krugersdorp'],
  logo: url('/images/brand/eastco-logo.png'),
};

export type Branch = {
  id: 'pretoria' | 'krugersdorp';
  name: string;
  region: string;
  phone: string;
  tel: string;
  whatsapp: string;
  email: string;
  address: string[];
  maps: string;
  embed: string;
};

const wa = (num: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent("Hi Eastco Decor Hire, I'd like to enquire about event hire.")}`;

export const branches: Branch[] = [
  {
    id: 'pretoria',
    name: 'Pretoria / Centurion',
    region: 'Hennopspark · Centurion',
    phone: '066 523 1125',
    tel: '+27665231125',
    whatsapp: wa('27665231125'),
    email: 'pta@eastcodecorhire.co.za',
    address: ["4E Coachman's Crescent", "Coachman's Business Park", 'Hennopspark, Centurion'],
    maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent("4E Coachman's Crescent, Coachman's Business Park, Hennopspark, Centurion"),
    embed: 'https://maps.google.com/maps?q=' + encodeURIComponent("Coachman's Crescent, Hennopspark, Centurion") + '&z=15&output=embed',
  },
  {
    id: 'krugersdorp',
    name: 'Krugersdorp',
    region: 'West Rand',
    phone: '078 019 2167',
    tel: '+27780192167',
    whatsapp: wa('27780192167'),
    email: 'kdp@eastcodecorhire.co.za',
    address: ['62 Pigot Road', 'Protea Ridges, Protearif', 'Krugersdorp'],
    maps: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('62 Pigot Road, Protea Ridges, Krugersdorp'),
    embed: 'https://maps.google.com/maps?q=' + encodeURIComponent('62 Pigot Road, Protea Ridges, Krugersdorp') + '&z=15&output=embed',
  },
];

export type PageKey = 'home' | 'catalogue' | 'gallery' | 'about' | 'contact' | 'legal' | 'none';

export const nav: {key: PageKey; label: string; href: string}[] = [
  {key: 'home', label: 'Home', href: url('/')},
  {key: 'catalogue', label: 'Hire Collection', href: url('/catalogue/')},
  {key: 'gallery', label: 'Inspiration', href: url('/gallery/')},
  {key: 'about', label: 'About', href: url('/about/')},
  {key: 'contact', label: 'Contact', href: url('/contact-us/')},
];

export const quoteHref = url('/contact-us/#quote');

export const socials = [
  {label: 'Facebook', href: 'https://www.facebook.com/eastcopartyhirepretoria/'},
  {label: 'Instagram', href: 'https://www.instagram.com/eastco_pretoria/'},
  {label: 'TikTok', href: 'https://www.tiktok.com/@eastcopartyhire'},
];

/* ------------------------------------------------------------------ Home */

export const hero = {
  caption: 'Weddings · Celebrations · Corporate',
  scrollHint: 'Scroll to explore',
  /** The photo story the hero plays as you scroll: landscape on wide screens, portrait on phones. */
  story: {
    wide: [photos.dolceTable, photos.florals, photos.brideTable],
    tall: [photos.dolceArbour, photos.terracotta, photos.belleCandles],
    captions: ['A Little Dolce · Rustic Gem Venue', 'Obsessions bridal editorial', 'Styled with Eastco pieces'],
  },
};

/** The three cards that land beside the photographs. */
export const perks = {
  eyebrow: 'Why Eastco',
  heading: ['Beautiful events', 'start here.'],
  items: [
    {title: 'Five collections, one supplier', note: 'Furniture, linen, décor, props and lawn games.'},
    {title: 'Two Gauteng branches', note: 'Centurion and Krugersdorp, close to your venue.'},
    {title: 'Real people, direct answers', note: 'Speak to the branch — no call centres, no bots.'},
  ],
};

/**
 * Manifesto, as runs of plain and emphasised text. Emphasised runs finish
 * in full ink with a gold rule drawn under them; the rest settle softer, so
 * the emphasised runs read as one sentence.
 */
export const manifesto: {text: string; em?: boolean}[] = [
  {text: 'Every event starts with an empty room and a feeling you want it to have.'},
  {text: 'We help you fill the room.', em: true},
  {text: 'Eastco Decor Hire supplies the'},
  {text: 'furniture, linen, tableware, props and lawn games', em: true},
  {text: 'behind weddings, birthdays, baby showers, conferences and corporate functions across Gauteng — from two branches in'},
  {text: 'Centurion and Krugersdorp.', em: true},
  {text: 'You bring the date and the dream.'},
  {text: 'We bring the pieces.', em: true},
];

export const marquee = [
  'Weddings',
  'Corporate events',
  'Private celebrations',
  'Conferences',
  'Outdoor functions',
  'Baby showers',
  'Birthdays',
  'Bridal showers',
];

export type Collection = {
  id: string;
  title: string;
  pages: number;
  size: string;
  pdf: string;
  cover: {src: string; w: number; h: number};
  summary: string;
  body: string;
  tags: string[];
  caption: string;
  /** Rows with a photo stack pin while the stack plays with the scroll. */
  stack?: Photo[];
};

export const collections: Collection[] = [
  {
    id: 'furniture',
    title: 'Furniture',
    pages: 18,
    size: '2.8 MB',
    pdf: url('/catalogues/eastco-furniture-september-2026.pdf'),
    cover: {src: url('/images/catalogues/furniture-cover.webp'), w: 598, h: 900},
    summary: 'Tables, chairs, occasional seating, lounge pieces and display furniture.',
    body: 'Tables, chairs, cocktail furniture, side tables, occasional chairs, lounge seating and other event furniture — the foundations every room is built on.',
    tags: ['Tables', 'Chairs', 'Lounge', 'Cocktail'],
    caption: 'Where everyone sits, gathers and lingers.',
  },
  {
    id: 'linen',
    title: 'Linen',
    pages: 51,
    size: '8.4 MB',
    pdf: url('/catalogues/eastco-linen-september-2026.pdf'),
    cover: {src: url('/images/catalogues/linen-cover.webp'), w: 617, h: 900},
    summary: 'Tablecloths, colours, prints, runners and event linen.',
    body: 'Floor-length and standard tablecloths, velvet, Mini Matt colours, damask, taffeta and a broad selection of printed table linen.',
    tags: ['Tablecloths', 'Runners', 'Napkins', 'Prints'],
    caption: 'The colour story starts with the cloth.',
  },
  {
    id: 'decor',
    title: 'Décor',
    pages: 97,
    size: '13 MB',
    pdf: url('/catalogues/eastco-decor-september-2026.pdf'),
    cover: {src: url('/images/catalogues/decor-cover.webp'), w: 1012, h: 1432},
    summary: 'Underplates, crockery, cutlery, glassware, cake stands, vases and candleware.',
    body: 'Underplates, crockery, cutlery, glassware, cake stands, vases, candleware and the finishing details that make a table feel complete.',
    tags: ['Tableware', 'Glassware', 'Candleware', 'Vases'],
    caption: 'Layer by layer, the table comes together.',
    stack: [photos.florals, photos.belleCandles, photos.dolceTable],
  },
  {
    id: 'props',
    title: 'Props',
    pages: 25,
    size: '3 MB',
    pdf: url('/catalogues/eastco-props-september-2026.pdf'),
    cover: {src: url('/images/catalogues/props-cover.webp'), w: 599, h: 900},
    summary: 'Wedding details, themed props, baskets and statement pieces.',
    body: 'Wedding signs and accessories, VIP red-carpet pieces, baby-shower décor, baskets, pendants, picnic pieces and themed props.',
    tags: ['Wedding', 'Baby shower', 'VIP', 'Picnic'],
    caption: 'The statement pieces people photograph.',
  },
  {
    id: 'games',
    title: 'Lawn Games',
    pages: 3,
    size: '0.6 MB',
    pdf: url('/catalogues/eastco-games-september-2026.pdf'),
    cover: {src: url('/images/catalogues/games-cover.webp'), w: 597, h: 900},
    summary: 'Cornhole, croquet, ring toss, Jenga, dominoes and more.',
    body: 'Relaxed entertainment for garden functions: cornhole, croquet, ring toss, Jenga, dominoes, tic-tac-toe and other outdoor games.',
    tags: ['Cornhole', 'Croquet', 'Jenga', 'Ring toss'],
    caption: 'Something for the guests between courses.',
  },
];

export const collectionMenu = {
  eyebrow: 'The hire collection',
  heading: 'Five collections. One beautiful table.',
  lede: 'Hire a single piece or dress the whole venue. Every collection has a current catalogue with product codes and listed prices.',
};

export const process = {
  eyebrow: 'How it works',
  heading: 'Four steps to your event day.',
  steps: [
    {
      title: 'Browse',
      image: photos.florals,
      days: '90 days',
      caption: 'Find the feeling first.',
      body: 'Open the September 2026 catalogues online, or download them to plan at your own pace.',
    },
    {
      title: 'Shortlist',
      image: photos.menu,
      days: '60 days',
      caption: 'Note the codes you love.',
      body: 'Write down the product codes and quantities of the pieces you want — every catalogue lists them.',
    },
    {
      title: 'Contact Eastco',
      image: photos.thankYou,
      days: '30 days',
      caption: 'Send us your shortlist.',
      body: 'WhatsApp, call or email your date, venue and shortlist to Centurion or Krugersdorp.',
    },
    {
      title: 'Confirm your hire',
      image: photos.belleCandles,
      days: 'Event day',
      caption: 'Light the candles.',
      body: 'We confirm availability, pricing and the booking details with you. Your prices are locked in once the order is accepted and the deposit is paid.',
    },
  ],
};

export const cta = {
  eyebrow: 'Your date is waiting',
  heading: 'Tell us your date.',
  lede: "Share your date, venue and shortlist and the branch nearest you will check what's available.",
  wordmark: 'CELEBRATE',
  sticker: 'EVENTS ✺ DÉCOR ✺ HIRE ✺ CENTURION ✺ KRUGERSDORP ✺ ',
  image: photos.dolceArbour,
  wideImage: photos.dolceTable,
};

/* ---------------------------------------------------------- Inner pages */

export const pageHeroes = {
  catalogue: {
    word: 'COLLECTION',
    eyebrow: 'Hire collection · September 2026',
    title: ['The Eastco', 'catalogues.'],
    lede: 'Five current catalogues with product codes, quantities and listed prices. Browse them online or download a copy to plan with.',
    image: photos.belleCandles,
    wide: photos.obsessionsTable,
  },
  gallery: {
    word: 'INSPIRATION',
    eyebrow: 'Real events & styling ideas',
    title: ['See it in', 'the room.'],
    lede: 'Three styling moods, three real events and a gallery of details — so you can picture the pieces together before you choose them.',
    image: photos.dolceBride,
    wide: photos.dolceTable,
  },
  about: {
    word: 'OUR STORY',
    eyebrow: 'About Eastco',
    title: ['One collection.', 'Every occasion.'],
    lede: 'Furniture, décor and practical event equipment for intimate gatherings, large functions and everything in between.',
    image: photos.obsessionsFlowers,
    wide: photos.brideTable,
  },
  contact: {
    word: 'CONTACT',
    eyebrow: 'Quotes & enquiries',
    title: ["Let's talk", 'about your event.'],
    lede: 'Send us your date, venue and shortlist. The branch nearest you will confirm availability and pricing personally.',
    image: photos.thankYou,
    wide: photos.florals,
  },
};

export const catalogueIntro = {
  note: 'Prices and quantities in the catalogues are subject to change, and are only guaranteed once your order is accepted and the deposit is paid.',
  howTo: [
    {title: 'Open a catalogue', body: 'View it in your browser or download the PDF to keep.'},
    {title: 'Note codes & quantities', body: 'Every item has a product code — jot down the ones you want and how many.'},
    {title: 'Send your shortlist', body: 'WhatsApp or email it to your nearest branch with your date and venue.'},
  ],
};

export const moods = {
  eyebrow: 'Create your look',
  heading: 'Begin with a feeling, then build the room around it.',
  items: [
    {
      n: '01',
      name: 'Modern Editorial',
      title: ['Quiet tones.', 'Strong details.'],
      body: 'Layer sculptural glass, dark tableware, warm metallics and restrained florals for a contemporary setting that still feels welcoming.',
      photos: [photos.florals, photos.menu, photos.brideCandle],
      swatches: ['#9b9a9d', '#e7c7c1', '#26292b', '#f4efe9'],
      lookFor: ['Black underplates & tableware', 'Crystal candle holders', 'Floor-length linen in soft grey', 'Sculptural vases'],
    },
    {
      n: '02',
      name: 'Classic Romance',
      title: ['Soft candlelight.', 'Layered tables.'],
      body: 'Glassware, candlelight, warm metallics and floral colour bring softness and depth to weddings, bridal events and formal celebrations.',
      photos: [photos.belleCandles, photos.dolceTable, photos.belleCloche],
      swatches: ['#f3ead6', '#e9c46a', '#c49a5b', '#ffffff'],
      lookFor: ['Gold candelabra & taper holders', 'Cut-crystal glassware', 'Ivory tablecloths', 'Gold cutlery'],
    },
    {
      n: '03',
      name: 'Natural & Relaxed',
      title: ['Texture first.', 'Easy atmosphere.'],
      body: 'Timber, dark seating, natural textures and simple table details work beautifully for outdoor functions, relaxed weddings and intimate celebrations.',
      photos: [photos.dolceArbour, photos.terracotta, photos.blueTable],
      swatches: ['#7a4e2d', '#c96d42', '#d8c3a0', '#2f3a2f'],
      lookFor: ['Timber tables', 'Black metal or bamboo chairs', 'Woven placemats', 'Chiffon runners'],
    },
  ],
};

export const realEvents = {
  eyebrow: 'Real events & editorial work',
  heading: 'Made to be seen in the room.',
  lede: 'Eastco pieces photographed in finished event settings, with the styling, florals and atmosphere around them.',
  items: [
    {
      kind: 'Bridal editorial',
      title: 'Obsessions Style Bridal Shoot',
      body: 'A refined editorial setting with blush florals, black tableware, glass details and candlelight — Eastco pieces working as a complete table rather than isolated products.',
      photos: [photos.obsessionsTable, photos.obsessionsBouquet, photos.obsessionsFlowers],
      credits: [
        ['Venue', 'Simplicity Venue'],
        ['Photography', 'Obsession Photography · Chantelle Lubbe'],
        ['Videography', 'DW Photography · Deon Van Wyk'],
        ['Décor', 'Eastco'],
        ['Florals', 'Magnifique Floral Art'],
      ],
    },
    {
      kind: 'Bows & Chic',
      title: 'A Little Dolce',
      body: 'Natural textures, dark seating and relaxed outdoor styling give this setup a warmer, rustic direction while still feeling considered and event-ready.',
      photos: [photos.dolceArbour, photos.dolceTable, photos.dolceBride],
      credits: [
        ['Venue', 'Rustic Gem Venue'],
        ['Photography', 'SALT Photography by Anel'],
        ['Videography', 'One Second One Shot Photography & Videography'],
        ['Décor & lighting', 'Eastco'],
        ['Florals & headpiece', 'The Floristry Studio'],
        ['Wedding dress', 'Silver Swallow Design'],
      ],
    },
    {
      kind: 'Bows & Chic',
      title: 'The Belle Team',
      body: 'A softer romantic setting with candleware, glassware, floral colour and layered table details — ideal inspiration for weddings and formal celebrations.',
      photos: [photos.belleCandles, photos.belleCloche, photos.belleAvenue],
      credits: [
        ['Concept', 'Erica Nijeboer · Bows & Chic'],
        ['Venue', 'Onder Engele Venue'],
        ['Photography', 'Celeste Cilliers Photography'],
        ['Makeup', 'SF PRO Makeup'],
        ['Table décor & hiring', 'Eastco'],
        ['Stationery', 'Monochrome Events & Designs'],
      ],
    },
  ],
};

export const galleryArchive = {
  eyebrow: 'From the archive',
  heading: 'Details worth saving.',
  photos: [
    photos.dolceTable,
    photos.velvetChair,
    photos.florals,
    photos.terracotta,
    photos.pearls,
    photos.brideCandle,
    photos.blueTable,
    photos.favours,
    photos.menu,
    photos.brideTable,
    photos.thankYou,
    photos.belleCloche,
    photos.dolceArbour,
    photos.obsessionsBouquet,
    photos.belleAvenue,
  ],
};

export const about = {
  story: {
    eyebrow: 'Who we are',
    heading: 'A broad hire collection, with people you can speak to directly.',
    paragraphs: [
      'Eastco Decor Hire supplies furniture, décor and practical event equipment for intimate gatherings, large functions and everything in between.',
      'From wedding tables and statement seating to linen, decorative props and lawn games, the collection is put together to help you build an event from the practical foundations through to the finishing details.',
      'We work from two Gauteng branches — Hennopspark in Centurion and Protea Ridges in Krugersdorp — so wherever your venue is, there is a team nearby who knows the stock and can tell you exactly what is available on your date.',
    ],
    image: photos.dolceArbour,
  },
  stats: [
    {value: 2, pad: true, label: 'Gauteng branches', note: 'Centurion and Krugersdorp.'},
    {value: 194, pad: false, label: 'Catalogue pages', note: 'Across the five September 2026 catalogues.'},
    {value: 5, pad: true, label: 'Collections', note: 'Furniture, linen, décor, props and lawn games.'},
    {value: 1, pad: false, label: 'Conversation', note: 'Speak to the branch directly — from shortlist to confirmed hire.', display: '1:1'},
  ],
  occasions: {
    eyebrow: 'Every kind of occasion',
    heading: 'From intimate dinners to grand celebrations.',
    items: [
      {title: 'Weddings', body: 'Ceremony seating, reception tables, linen, glassware and the details in between.'},
      {title: 'Corporate events', body: 'Year-end functions, launches and gala dinners that need to look polished.'},
      {title: 'Private celebrations', body: 'Milestone birthdays, anniversaries and dinners at home.'},
      {title: 'Conferences', body: 'Practical seating and tables for sessions, breakaways and lunches.'},
      {title: 'Outdoor functions', body: 'Garden parties and picnics, with lawn games to keep guests busy.'},
      {title: 'Baby & bridal showers', body: 'Themed props, pretty tableware and soft colour.'},
    ],
  },
  values: {
    eyebrow: 'Why clients choose Eastco',
    items: [
      {title: 'One collection, every detail', body: 'Furniture, linen, tableware, props and games from one supplier means one booking and one delivery to coordinate.'},
      {title: 'Two branches, closer to you', body: 'Pick the branch nearest your venue for quicker answers and easier collection or delivery.'},
      {title: 'Real people, direct answers', body: 'You speak to the branch that holds the stock — they confirm availability, quantities and pricing personally.'},
    ],
  },
};

export const contactPage = {
  before: {
    eyebrow: 'Before you contact us',
    heading: 'Three details make it quicker.',
    items: [
      {title: 'Your date', body: 'So the branch can check availability for your day straight away.'},
      {title: 'Your venue', body: 'The venue, suburb or area, plus any access or setup details you already know.'},
      {title: 'Your shortlist', body: 'Product codes and quantities from the September 2026 catalogues.'},
    ],
  },
  next: {
    eyebrow: 'What happens next',
    items: [
      {title: 'Send your details', body: 'Your date, venue, guest count and the product codes you have shortlisted.'},
      {title: 'We check availability', body: 'The branch checks current quantities for your date.'},
      {title: 'We confirm pricing', body: 'Current prices plus any collection or delivery details that apply.'},
      {title: 'Your booking is final', body: 'Confirmed directly with Eastco under the hire terms once the deposit is paid.'},
    ],
  },
  faqs: [
    {
      q: 'When is my booking confirmed?',
      a: 'Prices and quantities are only guaranteed once your order has been accepted and the deposit is paid. Until then, items can be booked by other clients.',
    },
    {
      q: 'How do I pay?',
      a: 'Hire charges and deposits are paid in cash on delivery unless otherwise agreed. Your deposit is refunded once the items are returned and checked (less a 10% banking fee if it was paid into an account).',
    },
    {
      q: 'What if I need to cancel?',
      a: 'Cancellations must be made in writing and acknowledged by Eastco. A 10% cancellation fee applies to paid bookings, including weather-related cancellations. At our discretion, payments may be moved to a new date, subject to availability.',
    },
    {
      q: 'How should items be returned?',
      a: 'Clean and in good condition. Never pack wet linen into a bag (it causes mould). Unwashed items may carry a cleaning fee, and lost or damaged items are charged at full replacement cost.',
    },
  ],
  eventTypes: ['Wedding', 'Corporate event', 'Birthday', 'Baby or bridal shower', 'Conference', 'Outdoor function', 'Other'],
};

export const terms = {
  updated: 'September 2026',
  intro: 'These terms apply to every Eastco Decor Hire booking. They are taken from the September 2026 catalogues.',
  sections: [
    {title: 'Prices & quantities', body: ['All prices and quantities are subject to change without notice and are only guaranteed once an order is accepted and the deposit is paid.']},
    {title: 'Hire agreement', body: ['Eastco CC ("the owner") rents out equipment to the customer under these terms. Both parties choose their listed addresses for official notices.']},
    {
      title: 'Payment & deposits',
      body: [
        'Hire charges and deposits must be paid in cash on delivery unless otherwise agreed.',
        'Deposits (less a 10% banking fee if paid into an account) and any deductions will be refunded within a reasonable time after return or collection.',
        'Any billing disputes must be made in writing within 3 days of the invoice date.',
      ],
    },
    {
      title: 'Hire period',
      body: [
        'The hire period starts upon delivery or collection and ends when the owner accepts the equipment back.',
        'Late returns are charged at the daily rate, plus travel fees if collected by the owner.',
        'Timely delivery is not guaranteed, and the owner is not liable for delay.',
      ],
    },
    {
      title: 'Equipment condition',
      body: [
        'Equipment is considered correct, clean and in good working order upon delivery unless issues are reported immediately.',
        'If equipment is faulty, the owner may replace it, repair it, or cancel and refund the hire.',
      ],
    },
    {
      title: 'Equipment care & return',
      body: [
        'The customer must store equipment in a dry, covered area and report malfunctions immediately. Repairs due to misuse are charged to the customer.',
        'Equipment must be returned clean and in good condition. Unwashed items may attract a cleaning fee, while stains beyond regular washing may incur dry-cleaning or replacement charges.',
        'Wet linen must not be put in a bag, to avoid mould. Tulle runners must be returned in good condition.',
        'Lost or damaged items are charged at full replacement cost. Equipment may not be swapped with substitutes.',
        "If items are not checked on return with the owner's representative, the owner's count is final.",
      ],
    },
    {
      title: 'Use of equipment',
      body: [
        "Equipment must only be used as intended and at the customer's own risk.",
        'Eastco is not liable for injuries, damages or losses caused by the use or malfunction of the equipment. The customer indemnifies Eastco against all related claims and legal costs.',
      ],
    },
    {
      title: 'Cancellations',
      body: [
        'All cancellations must be in writing and acknowledged by Eastco.',
        'A 10% cancellation fee applies to paid bookings. Weather-related cancellations are not exempt from this policy.',
        "At Eastco's discretion, payments may be transferred to a new date, subject to availability.",
      ],
    },
  ],
};

export const privacy = {
  updated: 'October 2026',
  intro:
    'Eastco Decor Hire respects your privacy. This notice explains what personal information we receive when you enquire about hire, why we need it and how we look after it, in line with the Protection of Personal Information Act (POPIA).',
  sections: [
    {
      title: 'What we collect',
      body: [
        'Only what you choose to send us: your name, phone number, email address, event date, venue and the items you would like to hire.',
        'The quote form on this website does not store anything. When you press send, it opens WhatsApp or your email app with your message filled in, and nothing reaches us until you send it from there.',
      ],
    },
    {
      title: 'How we use it',
      body: [
        'To answer your enquiry, check availability, prepare a quote, arrange delivery or collection and manage your booking, deposit and refund.',
        'We do not sell your information, and we do not add you to marketing lists without asking.',
      ],
    },
    {
      title: 'Services we rely on',
      body: [
        'WhatsApp, Google Maps, Google Fonts and our Facebook, Instagram and TikTok pages are run by third parties with their own privacy policies. The map on the contact page loads from Google when you view it.',
        'Our hosting provider may keep standard technical logs (such as IP address and browser type) for security.',
      ],
    },
    {
      title: 'How long we keep it',
      body: ['Enquiry and booking details are kept only as long as needed to complete your hire and meet our accounting and legal obligations.'],
    },
    {
      title: 'Your rights',
      body: [
        'You may ask what information we hold about you, and ask us to correct or delete it, by contacting either branch.',
        'If you are unhappy with how we have handled your information, you may complain to the Information Regulator of South Africa.',
      ],
    },
  ],
};

export const footer = {
  note: 'Furniture, linen, décor, props & lawn games for hire across Gauteng.',
};
