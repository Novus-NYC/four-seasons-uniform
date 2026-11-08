/**
 * Every business fact on the site lives here, so corrections are one-line edits.
 *
 * Source: raw messy data/four-seasons-uniform-research.md (compiled Nov 4, 2026)
 * plus the client brief referenced in that dossier. Anything marked CONFIRM is a
 * best reading of conflicting sources and should be checked with the owner.
 */

export type DayHours = {
  day: string
  short: string
  /** 24h "HH:MM" strings, or null when closed. Used for the "open now" badge. */
  open: string | null
  close: string | null
}

export const business = {
  /** CONFIRM: awning and owner say "Four Seasons Uniform"; Facebook and the old awning say "Four Seasons Fashion Uniforms". */
  name: "Four Seasons Uniform",
  formerName: "Four Seasons Fashion Uniforms",
  tagline: "Uniform store in Jackson Heights",
  category: "Uniform store",
  /** No exact opening year found. NY1 said "nearly 40 years" in Feb 2023. CONFIRM the year before printing "Since 19XX". */
  yearsLabel: "four decades",
  yearsLabelTitle: "Four decades",

  owner: {
    name: "John Park",
    origin: "Korea",
    arrivedYear: 1980,
    civicRole: "Member of Queens Community Board 7",
  },

  /** Client brief and current Google listing. (718) 672-4004 appears on Yelp, Facebook and the old awning. CONFIRM. */
  phone: { display: "(718) 458-4900", href: "tel:+17184584900" },

  address: {
    street: "73-19 Roosevelt Ave",
    streetLong: "73-19 Roosevelt Avenue",
    city: "Jackson Heights",
    region: "NY",
    postalCode: "11372",
    neighborhood: "Jackson Heights, Queens",
    crossStreets: "Between 73rd Street and Broadway",
    landmark: "Under the 7 train on Roosevelt Avenue",
    geo: { lat: 40.7469844, lng: -73.8916858 },
  },

  directions: {
    google:
      "https://www.google.com/maps/search/?api=1&query=Four+Seasons+Uniform%2C+73-19+Roosevelt+Ave%2C+Jackson+Heights%2C+NY+11372",
    apple:
      "https://maps.apple.com/?q=Four+Seasons+Uniform&address=73-19+Roosevelt+Ave,+Jackson+Heights,+NY+11372",
  },

  /** CONFIRM: inferred from the map, not stated by the business. */
  transit: {
    station: "Jackson Hts-Roosevelt Av / 74 St-Broadway",
    lines: ["7", "E", "F", "M", "R"],
    note: "A short walk from the station",
  },

  /** Google listing shows Thursday 10:03 AM; the 2021 Google-built site said 10:30 AM. Using 10:30 AM. CONFIRM. */
  hours: [
    { day: "Monday", short: "Mon", open: "10:30", close: "19:30" },
    { day: "Tuesday", short: "Tue", open: "10:30", close: "19:30" },
    { day: "Wednesday", short: "Wed", open: "10:30", close: "19:30" },
    { day: "Thursday", short: "Thu", open: "10:30", close: "19:30" },
    { day: "Friday", short: "Fri", open: "10:30", close: "19:30" },
    { day: "Saturday", short: "Sat", open: "10:30", close: "19:30" },
    { day: "Sunday", short: "Sun", open: null, close: null },
  ] satisfies DayHours[],
  hoursSummary: "Monday to Saturday, 10:30 AM to 7:30 PM",
  hoursSummaryShort: "Mon to Sat, 10:30 AM to 7:30 PM",
  closedSummary: "Closed Sunday",
  holidayNote: "Hours may change on holidays. Call ahead to be sure.",
  timeZone: "America/New_York",

  /** Client brief. In-store signs are English and Spanish. CONFIRM whether Spanish is spoken too. */
  languages: ["English", "Korean"],

  /** Yellow Pages. CONFIRM (and whether cash, Amex or tap-to-pay are accepted). */
  payment: ["Visa", "Mastercard", "Discover"],

  /** Posted counter sign (Google user photo, date unknown). A 2019 Yelp review mentions 3 months. CONFIRM. */
  policy: {
    headline: "No refunds. Exchanges or store credit within 14 days.",
    lines: [
      "No refunds.",
      "Exchanges or store credit within 14 days, with your receipt.",
      "Items must be in original condition with tags attached.",
    ],
  },

  /** Counter sign: "We can order if you don't find what you need. No extra charge. No shipping charge." */
  specialOrders: {
    headline: "Not on the rack? We can order it.",
    body: "If we don't have your size or style in stock, we can order it for you.",
    terms: ["No extra charge", "No shipping charge"],
  },

  social: {
    /** Business-owned page (named "Four Seasons Fashion Uniforms"). */
    facebook: "https://www.facebook.com/fourseasonsuniforms",
  },

  /** Owner's words in amNY (Nov 2025) and NY1 (Feb 2023). */
  customers: [
    "Nurses from Elmhurst Hospital",
    "Restaurant workers",
    "Custodians",
    "Home health aides",
  ],

  quotes: {
    outfitted: {
      text: "outfitted thousands of New Yorkers",
      source: "John Park, owner, writing in amNY (2025)",
    },
    firstNest: {
      text: "People's first nest.",
      context: "John Park on Jackson Heights, a first stop for so many newcomers",
      source: "NY1, February 2023",
    },
    service: {
      text: "We will continue to try to serve our customers with good service and price.",
      source: "John Park, replying to a customer review",
    },
  },

  press: [
    {
      outlet: "NY1",
      title: "In the Neighborhood: Jackson Heights",
      date: "February 2023",
      summary:
        "NY1 profiled John Park and his shop under the 7 train in a feature on Jackson Heights as a melting pot of the World's Borough.",
    },
  ],

  /** Text only. Logos need authorized-retailer permission. Awning brands are the most reliable. */
  brands: {
    onAwning: ["Cherokee", "Barco", "Grey's Anatomy", "Dickies", "Nurse Mates"],
    seenInStore: ["Maevn", "Jockey"],
    /** From a 2019 review "from what I can remember". CONFIRM before publishing. */
    unconfirmed: ["Elle", "Skechers", "Blossom", "WonderWink", "META"],
  },

  fits: ["Women's", "Men's", "Unisex", "Petite", "Tall", "Maternity-friendly"],

  /** Real garment colors seen on the racks and mannequins in store photos. */
  colors: [
    { name: "Navy", hex: "#22305f" },
    { name: "Ceil Blue", hex: "#8fa9d6" },
    { name: "Teal", hex: "#2a9a98" },
    { name: "Hunter Green", hex: "#245b45" },
    { name: "Wine", hex: "#6e2238" },
    { name: "Lavender", hex: "#a693c8" },
    { name: "Olive", hex: "#67683f" },
    { name: "Royal Blue", hex: "#2448b8" },
  ],

  /** Google, logged-out view, as of Nov 4, 2026. Update counts periodically. */
  reviews: {
    platform: "Google",
    rating: 4.3,
    count: 130,
    asOf: "November 2026",
    topics: [
      { label: "Helpful staff", count: 38 },
      { label: "Scrubs", count: 30 },
      { label: "Kind staff", count: 7 },
      { label: "Scrub suits", count: 5 },
      { label: "Variety of scrubs", count: 4 },
      { label: "Petite sizes", count: 2 },
    ],
    /** Paraphrased from public reviews (exact text was not captured). Replace with exact quotes once approved. */
    highlights: [
      {
        text: "The staff knew which scrubs would fit best for a taller customer.",
        author: "Valery E.",
        platform: "Google",
      },
      {
        text: "Came in last minute, found a great selection, got fitted well and had a second pair ordered.",
        author: "Dowaa A.",
        platform: "Google",
      },
      {
        text: "A customer for more than five years. Many models and colors, and they order your size if it's out.",
        author: "RunaCat Review",
        platform: "Google",
      },
    ],
  },
} as const

/**
 * Product categories. Drawn from reviews, signage, the Google description and
 * store photos. No prices are published anywhere, so none are shown.
 */
export const categories = [
  {
    id: "scrubs",
    title: "Scrubs",
    summary:
      "Brand-name scrub tops, pants, full sets and scrub jackets in solid colors and prints.",
    details: [
      "Tops, pants, sets and jackets",
      "Women's, men's and unisex cuts, for all ages",
      "Petite, tall and maternity-friendly options",
      "Solid colors plus printed and novelty tops",
    ],
    image: "racksScrubs",
  },
  {
    id: "lab-coats",
    title: "Lab coats and white shirts",
    summary: "Classic white lab coats and white dress shirts for clinic, pharmacy and lab work.",
    details: ["White lab coats", "White dress shirts"],
    image: "racksLabCoats",
  },
  {
    id: "shoes",
    title: "Nursing and work shoes",
    summary: "Shoes made for long shifts on your feet, from clogs to white leather nursing shoes.",
    details: ["Nursing shoes", "Clogs", "White leather work shoes", "Unisex styles"],
    image: "counterShoes",
  },
  {
    id: "accessories",
    title: "Nursing accessories",
    summary: "The small things you need for your shift, picked up in the same trip.",
    details: ["Nursing accessories", "Ask in store for what's in stock"],
    image: null,
  },
  {
    id: "work-uniforms",
    title: "Uniforms for other work",
    summary:
      "Not in healthcare? Restaurant workers, custodians and home health aides shop here too.",
    details: ["Restaurant work", "Custodial work", "Home health aides"],
    image: null,
  },
] as const

/**
 * Photos. All of these are customer uploads on Google Maps, downloaded and
 * self-hosted for this build. CONFIRM permission or replace with owner photos
 * before launch.
 */
export const photos = {
  storefront: {
    src: "/images/storefront-awning.webp",
    width: 1500,
    height: 2000,
    alt: "The royal blue Four Seasons Uniform awning on Roosevelt Avenue, with scrubs on mannequins in the window",
  },
  interiorWall: {
    src: "/images/interior-scrub-wall.webp",
    width: 1400,
    height: 1867,
    alt: "A yellow wall of scrub tops on mannequins above shelves of clogs and work shoes",
  },
  racksLabCoats: {
    src: "/images/racks-lab-coats.webp",
    width: 1800,
    height: 1013,
    alt: "Racks of white lab coats, white shirts and colored scrub tops",
  },
  counterShoes: {
    src: "/images/counter-work-shoes.webp",
    width: 1400,
    height: 1867,
    alt: "White nursing shoes and clogs on boxes at the counter, beside the store's special order sign",
  },
  sidewalk: {
    src: "/images/sidewalk-under-the-7.webp",
    width: 1100,
    height: 1957,
    alt: "The sidewalk on Roosevelt Avenue under the elevated 7 train, with the blue awning at right",
  },
  racksScrubs: {
    src: "/images/racks-scrubs.webp",
    width: 1800,
    height: 1013,
    alt: "Packed racks of scrubs in navy, teal, pink, white and printed fabrics",
  },
  oldAwning: {
    src: "/images/old-awning.webp",
    width: 1600,
    height: 1200,
    alt: "The earlier Four Seasons Fashion Uniforms awning, with a neon Uniforms and Shoes sign in the window",
  },
} as const

export type PhotoKey = keyof typeof photos

export const nav = [
  { href: "/pages/what-we-carry", label: "What we carry" },
  { href: "/pages/about", label: "About" },
  { href: "/pages/visit", label: "Visit" },
  { href: "/pages/visit#contact", label: "Contact" },
] as const

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const fullAddress = `${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`

/** "10:30" -> "10:30 AM". No leading zeroes. */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number)
  const suffix = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`
}
