import type { Metadata } from "next"
import Image from "next/image"
import { business, categories, photos } from "@/lib/business"
import PageHeader from "@/lib/components/page-header"
import VisitBand from "@/lib/components/visit-band"
import { CheckIcon, PhoneIcon } from "@/lib/components/icons"

export const metadata: Metadata = {
  title: "What We Carry",
  description:
    "Brand-name scrubs, lab coats, nursing and work shoes, nursing accessories and work uniforms in Jackson Heights. Petite, tall and maternity-friendly fits, and free special orders.",
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties

export default function WhatWeCarryPage() {
  const withPhoto = categories.filter((c) => c.image)
  const textOnly = categories.filter((c) => !c.image)
  const brands = [...business.brands.onAwning, ...business.brands.seenInStore]

  return (
    <>
      <PageHeader
        eyebrow="What we carry"
        title="Scrubs, lab coats, work shoes and more."
        lead="Brand-name medical scrubs, uniforms and nursing accessories in a wide range of colors, styles and sizes. Stock changes often, so call if you're looking for something specific."
      >
        <nav aria-label="Jump to a category">
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="inline-flex min-h-[40px] items-center rounded-full border border-white/35 px-4 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      {/* Categories with photos: alternating editorial splits */}
      <div className="bg-white">
        {withPhoto.map((c, i) => {
          const photo = photos[c.image as keyof typeof photos]
          const flip = i % 2 === 1
          const portrait = photo.height > photo.width
          return (
            <section key={c.id} id={c.id} className="border-b border-line py-14 lg:py-20" aria-labelledby={`${c.id}-title`}>
              <div className="container-site grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div
                  data-reveal="mask"
                  className={`relative overflow-hidden rounded-card ${portrait ? "aspect-[4/5] lg:mx-auto lg:w-[78%]" : "aspect-[16/10]"} ${flip ? "lg:order-2" : ""}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className={`object-cover ${c.id === "shoes" ? "object-[50%_78%]" : ""}`}
                  />
                </div>
                <div data-reveal style={d(80)}>
                  <h2 id={`${c.id}-title`} className="font-display text-4xl font-black leading-[1.06] sm:text-[2.75rem]">
                    {c.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{c.summary}</p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {c.details.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[16px] font-medium">
                        <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-awning" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {c.id === "scrubs" && (
                    <div className="mt-8">
                      <p className="text-sm font-semibold text-muted">A few of the colors on the racks</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {business.colors.map((col) => (
                          <li key={col.name} className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-semibold">
                            <span className="h-5 w-5 rounded-full border border-black/10" style={{ background: col.hex }} aria-hidden="true" />
                            {col.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Categories without photos */}
      <section className="bg-awning-mist py-14 lg:py-20" aria-label="More categories">
        <div className="container-site grid gap-5 md:grid-cols-2">
          {textOnly.map((c, i) => (
            <div key={c.id} id={c.id} data-reveal style={d(i * 90)} className="rounded-card bg-white p-7 shadow-lift sm:p-9">
              <h2 className="font-display text-3xl font-black">{c.title}</h2>
              <p className="mt-3 text-lg leading-relaxed text-muted">{c.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {c.details.map((item) => (
                  <li key={item} className="rounded-full bg-awning-mist px-3.5 py-1.5 text-[15px] font-semibold text-awning">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Fits and brands */}
      <section className="bg-white py-16 lg:py-24" aria-labelledby="fits-title">
        <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <p className="eyebrow text-ember">Sizes and fits</p>
            <h2 id="fits-title" className="mt-3 font-display text-4xl font-black leading-[1.06]">
              Cuts for every body.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              Not sure what fits? Ask our staff. They&apos;ll help you find the right size and cut, and match tops,
              pants and shoes.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {business.fits.map((f) => (
                <li key={f} className="rounded-lg border-2 border-awning px-4 py-2 font-display text-lg font-extrabold text-awning">
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={d(100)}>
            <p className="eyebrow text-ember">Brands</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-[1.06]">Brands on the racks.</h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              Brands you&apos;ll find in the shop. Looking for another one? Ask about a special order.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-8 border-t border-line">
              {brands.map((b) => (
                <li key={b} className="border-b border-line py-3.5 font-display text-xl font-extrabold text-awning-night">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Special orders */}
      <section className="border-y border-[#f1dc9a] bg-sun-soft py-14 lg:py-20" aria-labelledby="special-title">
        <div className="container-site grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div data-reveal>
            <p className="eyebrow text-awning">Special orders</p>
            <h2 id="special-title" className="mt-3 font-display text-4xl font-black leading-[1.06] sm:text-5xl">
              {business.specialOrders.headline}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-awning-night/80">{business.specialOrders.body}</p>
          </div>
          <div data-reveal style={d(100)} className="flex flex-col gap-4 lg:items-end">
            <ul className="flex flex-wrap gap-3">
              {business.specialOrders.terms.map((t) => (
                <li key={t} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 font-display text-lg font-extrabold shadow-lift">
                  <CheckIcon className="h-5 w-5 text-awning" />
                  {t}
                </li>
              ))}
            </ul>
            <a href={business.phone.href} className="btn-blue">
              <PhoneIcon className="h-[18px] w-[18px]" />
              Call {business.phone.display}
            </a>
          </div>
        </div>
      </section>

      <VisitBand />
    </>
  )
}
