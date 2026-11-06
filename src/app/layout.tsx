import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Figtree, Nunito } from "next/font/google"
import Navbar from "@/lib/components/navbar"
import Footer from "@/lib/components/footer"
import RevealObserver from "@/lib/components/reveal-observer"
import { business, photos, siteUrl } from "@/lib/business"

const display = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display",
  display: "swap",
})

const body = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

const description = `Brand-name scrubs, lab coats, nursing shoes and work uniforms at ${business.address.street} in ${business.address.neighborhood}. Friendly fitting help and free special orders, under the 7 train for ${business.yearsLabel}.`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | Scrubs and Uniforms in Jackson Heights, Queens`,
    template: `%s | ${business.name}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: business.name,
    title: `${business.name} | Scrubs and Uniforms in Jackson Heights`,
    description,
    images: [{ url: "/images/og-storefront.jpg", width: 1200, height: 630, alt: photos.storefront.alt }],
  },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: "#1e3fa3",
}

/** Runs before paint: enables JS-only styles, with a safety net if hydration stalls. */
const bootScript = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__fsReveal)document.documentElement.classList.add('reveal-fallback')},3000);`

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: business.name,
  alternateName: business.formerName,
  description,
  telephone: business.phone.display,
  url: siteUrl,
  image: `${siteUrl}${photos.storefront.src}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    postalCode: business.address.postalCode,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: business.address.geo.lat, longitude: business.address.geo.lng },
  openingHoursSpecification: business.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.day, opens: h.open, closes: h.close })),
  paymentAccepted: business.payment.join(", "),
  sameAs: [business.social.facebook],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-awning-night antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-sun px-4 py-3 font-semibold text-awning-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <RevealObserver />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
