import Image from "next/image"
import Link from "next/link"
import { business, categories, photos } from "@/lib/business"
import HeroFabric from "@/lib/components/hero-fabric"
import ContactSection from "@/lib/components/contact-section"
import ScrollStory from "@/lib/components/scroll-story/scroll-story"
import VisitBand from "@/lib/components/visit-band"
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon, Stars } from "@/lib/components/icons"

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties

export default function HomePage() {
  const { reviews } = business
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="container-site">
          <div className="hero-local-line">
            <span>
              <span className="local-dot" />
              Your neighborhood uniform shop
            </span>
            <span>Jackson Heights, Queens</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="rise">
                For every shift.
                <br />
                Every season.
              </h1>
              <p className="hero-description rise" style={d(90)}>
                You take care of everyone else. We&apos;ll take care of the fit. Find scrubs, uniforms and work shoes
                you&apos;ll feel good in, right here on Roosevelt Avenue.
              </p>
              <div className="hero-actions rise" style={d(150)}>
                <Link href="/pages/what-we-carry" className="btn-plum">
                  Find your fit <ArrowIcon className="h-[18px] w-[18px]" />
                </Link>
                <a href={business.directions.google} target="_blank" rel="noreferrer" className="btn-ghost">
                  <PinIcon className="h-[18px] w-[18px]" />
                  Visit the shop
                </a>
              </div>
              <div className="hero-trust rise" style={d(210)}>
                <div className="hero-rating">
                  <Stars rating={reviews.rating} className="h-4 w-4" />
                  <span>
                    <strong>{reviews.rating}</strong> on Google{" "}
                    <span className="text-muted">({reviews.count} reviews)</span>
                  </span>
                </div>
                <p>Helping Queens get ready for work for {business.yearsLabel}.</p>
              </div>
            </div>
            <div className="hero-art">
              <HeroFabric />
              <div className="hero-shop-stamp">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={photos.storefront.src}
                    alt="Four Seasons Uniform storefront"
                    fill
                    priority
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <strong>Your next great fit is right around the corner.</strong>
                  <span>{business.address.street} · Under the 7 train</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-brands">
            <span className="hero-brands-label">
              The names you know.
              <br />
              The comfort you count on.
            </span>
            <ul aria-label="Brands in store">
              {business.brands.onAwning.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Quick info */}
      <section aria-label="Store information" className="border-b border-line bg-white">
        <div className="container-site grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="flex gap-4 py-6 md:pr-8">
            <ClockIcon className="mt-0.5 h-6 w-6 shrink-0 text-awning" />
            <div>
              <h2 className="font-display text-lg font-extrabold">{business.hoursSummaryShort}</h2>
              <p className="mt-1 text-muted">{business.closedSummary}</p>
              <Link href="/pages/visit#hours" className="link-arrow mt-2 text-[15px]">
                All hours
              </Link>
            </div>
          </div>
          <div className="flex gap-4 py-6 md:px-8">
            <PinIcon className="mt-0.5 h-6 w-6 shrink-0 text-awning" />
            <div>
              <h2 className="font-display text-lg font-extrabold">{business.address.street}</h2>
              <p className="mt-1 text-muted">{business.address.crossStreets}</p>
              <a
                href={business.directions.google}
                target="_blank"
                rel="noreferrer"
                className="link-arrow mt-2 text-[15px]"
              >
                Directions
              </a>
            </div>
          </div>
          <div className="flex gap-4 py-6 md:pl-8">
            <PhoneIcon className="mt-0.5 h-6 w-6 shrink-0 text-awning" />
            <div>
              <h2 className="font-display text-lg font-extrabold">{business.phone.display}</h2>
              <p className="mt-1 text-muted">Call to check sizes or place a special order</p>
              <a href={business.phone.href} className="link-arrow mt-2 text-[15px]">
                Call the shop
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- Scroll story */}
      <section className="bg-white pb-6 pt-16 lg:pb-8 lg:pt-24">
        <div className="container-site">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow text-ember">Shopping with us</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-[1.06] text-awning-night sm:text-5xl">
              Come in for scrubs. Leave with the right fit.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              A small shop with full racks, and people who will help you find what works for your shift.
            </p>
          </div>
        </div>
      </section>
      <ScrollStory />

      {/* ------------------------------------------------ What we carry */}
      <section className="border-t border-line bg-paper py-16 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <div data-reveal>
              <p className="eyebrow text-ember">What we carry</p>
              <h2 className="mt-3 font-display text-4xl font-black leading-[1.06] sm:text-5xl">
                Everything for the job, head to toe.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
                No online catalog, just a shop full of real stock. Here&apos;s what you&apos;ll find on the racks.
              </p>
            </div>
            <ul className="mt-8 border-t border-line">
              {categories.map((c, i) => (
                <li key={c.id} data-reveal style={d(i * 60)} className="border-b border-line">
                  <Link
                    href={`/pages/what-we-carry#${c.id}`}
                    className="group flex items-start justify-between gap-6 py-5 transition-colors hover:text-awning"
                  >
                    <span>
                      <span className="block font-display text-xl font-extrabold sm:text-2xl">{c.title}</span>
                      <span className="mt-1 block text-[15px] leading-relaxed text-muted">{c.summary}</span>
                    </span>
                    <ArrowIcon className="mt-1.5 h-5 w-5 shrink-0 text-awning transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/pages/what-we-carry" className="btn-plum mt-8">
              See what we carry
            </Link>
          </div>

          <div className="relative grid grid-cols-5 grid-rows-[auto_auto] gap-4 self-start lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
            <div data-reveal="mask" className="relative col-span-5 aspect-[16/10] overflow-hidden rounded-card">
              <Image
                src={photos.racksScrubs.src}
                alt={photos.racksScrubs.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              data-reveal="mask"
              style={d(120)}
              className="relative col-span-3 aspect-[4/5] overflow-hidden rounded-card"
            >
              <Image
                src={photos.interiorWall.src}
                alt={photos.interiorWall.alt}
                fill
                sizes="(min-width: 1024px) 24vw, 60vw"
                className="object-cover"
              />
            </div>
            <div
              data-reveal="mask"
              style={d(220)}
              className="relative col-span-2 aspect-[4/5] self-end overflow-hidden rounded-card"
            >
              <Image
                src={photos.counterShoes.src}
                alt={photos.counterShoes.alt}
                fill
                sizes="(min-width: 1024px) 16vw, 40vw"
                className="object-cover object-[50%_80%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- Neighborhood */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <figure data-reveal="mask" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card">
              <Image
                src={photos.oldAwning.src}
                alt={photos.oldAwning.alt}
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              The shop&apos;s earlier awning, when the name read {business.formerName}.
            </figcaption>
          </figure>
          <div className="order-1 lg:order-2" data-reveal>
            <p className="eyebrow text-ember">{business.yearsLabelTitle} on Roosevelt Avenue</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-[1.06] sm:text-5xl">
              A neighborhood shop that dresses Queens for work.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {business.owner.name} came to New York from {business.owner.origin} in {business.owner.arrivedYear} to
              build something of his own. In his words, the shop has &ldquo;{business.quotes.outfitted.text},&rdquo;
              from nurses at nearby Elmhurst Hospital to the people who keep the neighborhood&apos;s kitchens and
              buildings running.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Who shops here">
              {business.customers.map((c) => (
                <li key={c} className="rounded-full bg-awning-mist px-3.5 py-1.5 text-[15px] font-semibold text-awning">
                  {c}
                </li>
              ))}
            </ul>
            <Link href="/pages/about" className="link-arrow mt-8 text-lg">
              Read our story <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Reviews */}
      <section className="border-t border-line bg-paper py-16 lg:py-24" aria-labelledby="reviews-title">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div data-reveal>
            <p className="eyebrow text-ember">What customers say</p>
            <h2 id="reviews-title" className="mt-3 font-display text-4xl font-black leading-[1.06] sm:text-5xl">
              Known for helpful staff.
            </h2>
            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-7xl font-black leading-none text-awning">{reviews.rating}</span>
              <span className="pb-1.5">
                <Stars rating={reviews.rating} className="h-5 w-5" />
                <span className="mt-1 block text-[15px] font-semibold text-muted">
                  {reviews.count} reviews on {reviews.platform}
                </span>
              </span>
            </div>
            <h3 className="mt-8 text-sm font-semibold text-muted">Most mentioned in reviews</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {reviews.topics.map((t) => (
                <li
                  key={t.label}
                  className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[15px] font-semibold"
                >
                  {t.label} <span className="font-normal text-muted">{t.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            {reviews.highlights.map((r, i) => (
              <figure
                key={r.author}
                data-reveal
                style={d(i * 90)}
                className="rounded-card border border-line bg-white p-6 shadow-lift sm:p-7"
              >
                <blockquote className="font-display text-xl font-bold leading-snug text-awning-night sm:text-[1.4rem]">
                  {r.text}
                </blockquote>
                <figcaption className="mt-4 text-[15px] text-muted">
                  <span className="font-semibold text-awning-night">{r.author}</span>, {r.platform} review
                </figcaption>
              </figure>
            ))}
            <p className="text-sm text-muted">
              Reviews are paraphrased. Rating and counts from {reviews.platform}, {reviews.asOf}.{" "}
              <a
                href={business.directions.google}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-awning underline underline-offset-4"
              >
                Read all reviews
              </a>
            </p>
          </div>
        </div>
      </section>

      <VisitBand />
      <ContactSection />
    </>
  )
}
