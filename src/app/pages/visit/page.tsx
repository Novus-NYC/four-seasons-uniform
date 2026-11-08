import type { Metadata } from "next"
import Image from "next/image"
import { business, photos } from "@/lib/business"
import LocationMap from "@/lib/components/location-map"
import ContactSection from "@/lib/components/contact-section"
import PageHeader from "@/lib/components/page-header"
import HoursTable from "@/lib/components/hours-table"
import OpenStatus from "@/lib/components/open-status"
import { PhoneIcon, PinIcon } from "@/lib/components/icons"

export const metadata: Metadata = {
  title: "Visit",
  description: `Hours, directions and store policies for ${business.name}, ${business.address.street} in ${business.address.neighborhood}. ${business.hoursSummary}.`,
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties

const faqs: { q: string; a: string }[] = [
  {
    q: "Can you order a size or style you don't have?",
    a: `Yes. ${business.specialOrders.body} ${business.specialOrders.terms.join(". ")}.`,
  },
  {
    q: "Do you carry petite, tall and maternity scrubs?",
    a: "Yes. We have petite, tall and maternity-friendly options, plus women's, men's and unisex cuts. Our staff can help you find the right fit.",
  },
  {
    q: "What is your return policy?",
    a: business.policy.lines.join(" "),
  },
  {
    q: "Which brands do you carry?",
    a: `${[...business.brands.onAwning, ...business.brands.seenInStore].join(", ")}. Ask about others, since we can special order.`,
  },
  {
    q: "Do you sell uniforms for jobs outside healthcare?",
    a: "Yes. Restaurant workers, custodians and home health aides shop with us too.",
  },
  {
    q: "Can I shop online?",
    a: `We don't sell online. Stop by the shop, or call ${business.phone.display} to check whether we have your size.`,
  },
  {
    q: "What languages do you speak?",
    a: `${business.languages.join(" and ")}.`,
  },
]

export default function VisitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Visit"
        title="Find us under the 7 train."
        lead={`${business.address.streetLong}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}. ${business.address.crossStreets}, under the blue awning.`}
        aside={
          <div className="relative aspect-[16/11] overflow-hidden rounded-card lg:ml-auto lg:aspect-[4/5] lg:max-h-[480px] lg:w-[85%]">
            <Image src={photos.sidewalk.src} alt={photos.sidewalk.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[50%_40%]" />
          </div>
        }
      >
        <OpenStatus tone="dark" />
        <div className="mt-5 flex flex-wrap gap-3">
          <a href={business.directions.google} target="_blank" rel="noreferrer" className="btn-sun">
            <PinIcon className="h-[18px] w-[18px]" />
            Google Maps
          </a>
          <a href={business.directions.apple} target="_blank" rel="noreferrer" className="btn-ghost-light">
            Apple Maps
          </a>
          <a href={business.phone.href} className="btn-ghost-light">
            <PhoneIcon className="h-[18px] w-[18px]" />
            {business.phone.display}
          </a>
        </div>
      </PageHeader>

      <section className="bg-paper py-10 sm:py-14" aria-label="Store location map">
        <div className="container-site">
          <LocationMap />
        </div>
      </section>

      {/* Essentials */}
      <section className="bg-white py-14 lg:py-20" aria-label="Hours and getting here">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div id="hours" data-reveal>
            <h2 className="font-display text-3xl font-black sm:text-4xl">Hours</h2>
            <HoursTable className="mt-5" />
            <p className="mt-4 text-[15px] text-muted">{business.holidayNote}</p>
          </div>

          <div data-reveal style={d(100)} className="space-y-10">
            <div>
              <h2 className="font-display text-3xl font-black sm:text-4xl">Getting here</h2>
              <dl className="mt-5 space-y-5 text-[17px] leading-relaxed">
                <div>
                  <dt className="font-semibold">Address</dt>
                  <dd className="text-muted">
                    {business.address.street}, {business.address.city}, {business.address.region} {business.address.postalCode}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Cross streets</dt>
                  <dd className="text-muted">{business.address.crossStreets}, {business.address.landmark.charAt(0).toLowerCase() + business.address.landmark.slice(1)}</dd>
                </div>
                <div>
                  <dt className="font-semibold">By subway</dt>
                  <dd className="text-muted">
                    {business.transit.note} from {business.transit.station}.
                    <span className="mt-2 flex gap-1.5" aria-label={`Lines ${business.transit.lines.join(", ")}`}>
                      {business.transit.lines.map((l) => (
                        <span key={l} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-awning-night text-sm font-bold text-white" aria-hidden="true">
                          {l}
                        </span>
                      ))}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Phone</dt>
                  <dd>
                    <a href={business.phone.href} className="font-semibold text-awning underline underline-offset-4">
                      {business.phone.display}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Languages</dt>
                  <dd className="text-muted">{business.languages.join(" and ")}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />

      {/* Policies */}
      <section id="policies" className="border-y border-line bg-paper py-14 lg:py-20" aria-labelledby="policies-title">
        <div className="container-site">
          <h2 id="policies-title" className="font-display text-3xl font-black sm:text-4xl" data-reveal>
            Before you buy
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div data-reveal className="rounded-card border border-line bg-white p-6 sm:p-7">
              <h3 className="font-display text-xl font-extrabold">Store policy</h3>
              <ul className="mt-3 space-y-2 leading-relaxed text-muted">
                {business.policy.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div data-reveal style={d(90)} className="rounded-card border border-line bg-white p-6 sm:p-7">
              <h3 className="font-display text-xl font-extrabold">Special orders</h3>
              <p className="mt-3 leading-relaxed text-muted">{business.specialOrders.body}</p>
              <p className="mt-2 font-semibold">{business.specialOrders.terms.join(". ")}.</p>
            </div>
            <div data-reveal style={d(180)} className="rounded-card border border-line bg-white p-6 sm:p-7">
              <h3 className="font-display text-xl font-extrabold">Payment</h3>
              <p className="mt-3 leading-relaxed text-muted">We accept {business.payment.slice(0, -1).join(", ")} and {business.payment.at(-1)}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14 lg:py-20" aria-labelledby="faq-title">
        <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <h2 id="faq-title" className="font-display text-3xl font-black sm:text-4xl">
              Common questions
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">Something else? Give us a call.</p>
            <a href={business.phone.href} className="btn-plum mt-6">
              <PhoneIcon className="h-[18px] w-[18px]" />
              Call {business.phone.display}
            </a>
          </div>
          <div className="border-t border-line" data-reveal style={d(80)}>
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-extrabold marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="relative h-4 w-4 shrink-0 text-awning" aria-hidden="true">
                    <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded bg-current" />
                    <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rounded bg-current transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="-mt-1 max-w-2xl pb-5 text-[17px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
