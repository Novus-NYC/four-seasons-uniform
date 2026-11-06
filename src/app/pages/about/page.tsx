import type { Metadata } from "next"
import Image from "next/image"
import { business, photos } from "@/lib/business"
import PageHeader from "@/lib/components/page-header"
import VisitBand from "@/lib/components/visit-band"

export const metadata: Metadata = {
  title: "Our Story",
  description: `${business.owner.name} came to New York from ${business.owner.origin} in ${business.owner.arrivedYear}. His uniform shop on Roosevelt Avenue has dressed Jackson Heights for work for ${business.yearsLabel}.`,
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties

export default function AboutPage() {
  const { owner, quotes, press } = business
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title={`${business.yearsLabelTitle} under the 7 train.`}
        lead={`${owner.name}'s shop has sold scrubs, lab coats and work shoes on Roosevelt Avenue for ${business.yearsLabel}, to nurses, restaurant workers, custodians and home health aides from across Queens.`}
      />

      {/* Story */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_minmax(0,40rem)_0.6fr] lg:gap-10">
          <aside className="hidden lg:block" aria-hidden="true">
            <p className="sticky top-[calc(var(--nav-h)+2rem)] font-display text-[7rem] font-black leading-none text-awning-mist">
              {owner.arrivedYear}
            </p>
          </aside>
          <div className="space-y-6 text-lg leading-[1.75] text-awning-night/90" data-reveal>
            <p className="font-display text-2xl font-extrabold leading-snug text-awning-night sm:text-[1.75rem]">
              {owner.name} came to New York from {owner.origin} in {owner.arrivedYear}, to build something of his own.
            </p>
            <p>
              He believed hard work, fairness and a commitment to community could lead to a better life. That
              something became {business.name}, a shop on Roosevelt Avenue between 73rd Street and Broadway, right
              under the elevated 7 train.
            </p>
            <p>
              The regulars are the people who keep the neighborhood running: nurses from nearby Elmhurst Hospital,
              restaurant workers, custodians and home health aides. In John&apos;s words, the shop has &ldquo;
              {quotes.outfitted.text}.&rdquo;
            </p>

            <figure className="my-10 border-l-4 border-sun py-2 pl-6 sm:pl-8">
              <blockquote className="font-display text-4xl font-black leading-tight text-awning sm:text-5xl">
                &ldquo;{quotes.firstNest.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-base text-muted">
                {owner.name} on Jackson Heights, a first stop for so many newcomers. {quotes.firstNest.source}.
              </figcaption>
            </figure>

            <p>
              John has described Jackson Heights as being like a small United Nations, and the shop reflects it. Signs
              at the counter are in English and Spanish, and the staff speaks {business.languages.join(" and ")}.
            </p>
            <p>Today John is also a {owner.civicRole.charAt(0).toLowerCase() + owner.civicRole.slice(1)}.</p>
          </div>
        </div>
      </section>

      {/* Then and now */}
      <section className="border-t border-line bg-paper py-16 lg:py-24" aria-labelledby="then-now-title">
        <div className="container-site">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow text-ember">Then and now</p>
            <h2 id="then-now-title" className="mt-3 font-display text-4xl font-black leading-[1.06] sm:text-5xl">
              Same blue awning, same corner.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              The sign used to read {business.formerName}. Today it reads {business.name}. The colors stayed.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-end">
            <figure data-reveal="mask">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image src={photos.oldAwning.src} alt={photos.oldAwning.alt} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-sm font-semibold text-muted">Then: {business.formerName}</figcaption>
            </figure>
            <figure data-reveal="mask" style={d(140)}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-card">
                <Image src={photos.storefront.src} alt={photos.storefront.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover object-[50%_30%]" />
              </div>
              <figcaption className="mt-3 text-sm font-semibold text-muted">Now: {business.name}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-white py-16 lg:py-24" aria-labelledby="values-title">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <div data-reveal>
              <p className="eyebrow text-ember">How we work</p>
              <h2 id="values-title" className="mt-3 font-display text-4xl font-black leading-[1.06] sm:text-5xl">
                Good service and a fair price.
              </h2>
              <figure className="mt-6">
                <blockquote className="text-lg italic leading-relaxed text-muted">&ldquo;{quotes.service.text}&rdquo;</blockquote>
                <figcaption className="mt-2 text-[15px] font-semibold">{quotes.service.source}</figcaption>
              </figure>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-card border border-line bg-line">
              {[
                {
                  title: "Help with the fit",
                  body: `"Helpful staff" is the most mentioned topic in our ${business.reviews.platform} reviews. Ask us about sizing, cuts and what goes together.`,
                },
                {
                  title: "We'll order what's missing",
                  body: `${business.specialOrders.body} ${business.specialOrders.terms.join(". ")}.`,
                },
                {
                  title: "Clear store policy",
                  body: business.policy.lines.join(" "),
                },
              ].map((v, i) => (
                <li key={v.title} data-reveal style={d(i * 90)} className="flex gap-5 bg-white p-6 sm:p-8">
                  <span className="font-display text-3xl font-black leading-none text-sun" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-extrabold">{v.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="border-t border-line bg-awning-mist py-14 lg:py-16" aria-labelledby="press-title">
        <div className="container-site">
          <h2 id="press-title" className="eyebrow text-awning">
            In the news
          </h2>
          {press.map((p) => (
            <article key={p.outlet} data-reveal className="mt-4 grid gap-4 md:grid-cols-[auto_1fr] md:items-baseline md:gap-10">
              <p className="font-display text-5xl font-black text-awning">{p.outlet}</p>
              <div>
                <h3 className="font-display text-2xl font-extrabold">
                  {p.title} <span className="font-sans text-base font-semibold text-muted">({p.date})</span>
                </h3>
                <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted">{p.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <VisitBand />
    </>
  )
}
